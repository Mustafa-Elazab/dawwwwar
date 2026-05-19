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

    return this.otpService.sendOtp(phone);
  }

  // ── Verify OTP ────────────────────────────────────────────────────
  async verifyOtp(
    rawPhone: string,
    code: string,
    requiredRole: UserRole,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<UserEntity>;
    isNewUser: boolean;
  }> {
    const phone = this.normalizePhone(rawPhone);
    const { valid, remaining } = await this.otpService.verifyOtp(phone, code);

    if (!valid) {
      if (remaining === 0) throw new BadRequestException('OTP_LOCKED');
      throw new BadRequestException(`INVALID_OTP:${remaining}`);
    }

    let user = await this.userRepo.findOne({ where: { phone } });

    if (!user) {
      // New user — create with the role of the app they registered through
      user = this.userRepo.create({
        phone,
        name: '',
        role: requiredRole,
        isApproved: requiredRole === UserRole.CUSTOMER, // customers auto-approved
      });
      user = await this.userRepo.save(user);

      // Create wallet for this new user
      const wallet = this.walletRepo.create({ userId: user.id, balance: 0, currency: 'EGP' });
      await this.walletRepo.save(wallet);
    } else {
      // Existing user — ROLE CHECK
      if (user.role !== requiredRole) {
        throw new ForbiddenException(this.getRoleMismatchMessage(user.role, requiredRole));
      }
    }

    const isNewUser = !user.name;

    // Auto-approve customers if not already
    if (user.role === UserRole.CUSTOMER && !user.isApproved) {
      user.isApproved = true;
      await this.userRepo.save(user);
    }

    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.save(user);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
      isNewUser,
    };
  }

  // ── Human-readable error messages ────────────────────────────────────────
  private getRoleMismatchMessage(actualRole: UserRole, requiredRole: UserRole): string {
    const messages: Record<string, string> = {
      [`${UserRole.CUSTOMER}_into_${UserRole.MERCHANT}`]:
        'This number is registered as a customer account. To register as a merchant, please contact us.',
      [`${UserRole.CUSTOMER}_into_${UserRole.DRIVER}`]:
        'This number is registered as a customer account. To register as a driver, please contact us.',
      [`${UserRole.MERCHANT}_into_${UserRole.CUSTOMER}`]:
        'This number is registered as a merchant account. Please use the Dawwar Partner app.',
      [`${UserRole.MERCHANT}_into_${UserRole.DRIVER}`]:
        'This number is registered as a merchant. You cannot also be a driver.',
      [`${UserRole.DRIVER}_into_${UserRole.CUSTOMER}`]:
        'This number is registered as a driver. Please use the Dawwar Driver app.',
      [`${UserRole.DRIVER}_into_${UserRole.MERCHANT}`]:
        'This number is registered as a driver. You cannot also be a merchant.',
    };

    const key = `${actualRole}_into_${requiredRole}`;
    return messages[key] ?? `This account has role ${actualRole}, not ${requiredRole}.`;
  }

  private sanitizeUser(user: UserEntity): Partial<UserEntity> {
    const { refreshToken, ...sanitized } = user;
    return sanitized;
  }

  // ── Refresh tokens ────────────────────────────────────────────────
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Extract userId from the refresh token payload (secure — no client-supplied userId)
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new ForbiddenException('INVALID_REFRESH_TOKEN');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user?.refreshToken) throw new ForbiddenException('ACCESS_DENIED');

    const matches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matches) throw new ForbiddenException('ACCESS_DENIED');

    const tokens = await this.generateTokens(user);
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.save(user);
    return tokens;
  }

  // ── Logout ────────────────────────────────────────────────────────
  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshToken: undefined });
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
