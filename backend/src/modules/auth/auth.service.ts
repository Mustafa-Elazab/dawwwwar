import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { WalletEntity } from '../../database/entities/wallet.entity';
import { OtpService } from './otp.service';
import type { JwtPayload } from './jwt.strategy';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ── Normalize Egyptian phone ──────────────────────────────────────
  private normalizePhone(raw: string): string {
    return raw
      .replace(/^\+20/, '0')
      .replace(/^20(?=1)/, '0')
      .replace(/[\s-]/g, '');
  }

  private validatePhone(phone: string): boolean {
    return /^01[0125]\d{8}$/.test(phone);
  }

  // ── Send OTP ──────────────────────────────────────────────────────
  async sendOtp(rawPhone: string): Promise<{ expiresIn: number }> {
    const phone = this.normalizePhone(rawPhone);
    if (!this.validatePhone(phone)) {
      throw new BadRequestException('INVALID_PHONE');
    }

    // Create user if first time
    let user = await this.userRepo.findOne({ where: { phone } });
    if (!user) {
      user = this.userRepo.create({ phone, name: phone, role: UserRole.CUSTOMER });
      user = await this.userRepo.save(user);

      // Create wallet for new user
      const wallet = this.walletRepo.create({ userId: user.id, balance: 0, currency: 'EGP' });
      await this.walletRepo.save(wallet);
    }

    return this.otpService.sendOtp(phone);
  }

  // ── Verify OTP ────────────────────────────────────────────────────
  async verifyOtp(
    rawPhone: string,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserEntity; isFirstLogin: boolean }> {
    const phone = this.normalizePhone(rawPhone);
    const { valid, remaining } = await this.otpService.verifyOtp(phone, code);

    if (!valid) {
      if (remaining === 0) throw new BadRequestException('OTP_LOCKED');
      throw new BadRequestException(`INVALID_OTP:${remaining}`);
    }

    const user = await this.userRepo.findOne({ where: { phone } });
    if (!user) throw new UnauthorizedException('USER_NOT_FOUND');

    const isFirstLogin = !user.isApproved && user.role === UserRole.CUSTOMER;

    // Auto-approve customers
    if (user.role === UserRole.CUSTOMER && !user.isApproved) {
      user.isApproved = true;
    }

    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.save(user);

    return { ...tokens, user, isFirstLogin };
  }

  // ── Refresh tokens ────────────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.refreshToken) throw new ForbiddenException('Access denied');

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new ForbiddenException('Access denied');

    const tokens = await this.generateTokens(user);
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.save(user);
    return tokens;
  }

  // ── Logout ────────────────────────────────────────────────────────
  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: undefined });
  }

  // ── Select role (first login) ─────────────────────────────────────
  async selectRole(userId: string, role: UserRole): Promise<UserEntity> {
    if (role === UserRole.ADMIN) throw new ForbiddenException('Cannot assign admin role');

    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    user.role = role;

    // Merchants and drivers need approval
    user.isApproved = role === UserRole.CUSTOMER;

    return this.userRepo.save(user);
  }

  // ── Private helpers ───────────────────────────────────────────────
  private async generateTokens(user: UserEntity): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, phone: user.phone, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessExpiresIn') ?? '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn') ?? '30d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
