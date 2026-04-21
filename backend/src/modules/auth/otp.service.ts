import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(phone: string): Promise<{ expiresIn: number }> {
    const isSandbox = this.config.get<boolean>('app.otpSandbox');
    const expiresSeconds = this.config.get<number>('app.otpExpiresSeconds') ?? 120;

    const code = isSandbox
      ? this.config.get<string>('app.otpSandboxCode') ?? '123456'
      : this.generateCode();

    // Store in Redis with TTL
    const key = `otp:${phone}`;
    await this.cache.set(key, JSON.stringify({ code, attempts: 0 }), expiresSeconds * 1000);

    if (isSandbox) {
      this.logger.log(`[SANDBOX] OTP for ${phone}: ${code}`);
    } else {
      // Phase 2 Twilio integration — inject after Task 03
      // const twilio = new Twilio(accountSid, authToken);
      // await twilio.messages.create({
      //   body: `Dawwar verification code: ${code}`,
      //   from: this.config.get('TWILIO_PHONE_NUMBER'),
      //   to: `+20${phone.replace(/^0/, '')}`,
      // });
      this.logger.log(`OTP sent to ${phone} via SMS`);
    }

    return { expiresIn: expiresSeconds };
  }

  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<{ valid: boolean; remaining: number }> {
    const key = `otp:${phone}`;
    const raw = await this.cache.get<string>(key);

    if (!raw) {
      return { valid: false, remaining: 0 };
    }

    const data = JSON.parse(raw) as { code: string; attempts: number };
    const MAX_ATTEMPTS = 5;

    if (data.attempts >= MAX_ATTEMPTS) {
      await this.cache.del(key);
      return { valid: false, remaining: 0 };
    }

    if (data.code !== code) {
      data.attempts += 1;
      const expiresSeconds = this.config.get<number>('app.otpExpiresSeconds') ?? 120;
      await this.cache.set(key, JSON.stringify(data), expiresSeconds * 1000);
      return { valid: false, remaining: MAX_ATTEMPTS - data.attempts };
    }

    // Valid — delete OTP so it can't be reused
    await this.cache.del(key);
    return { valid: true, remaining: MAX_ATTEMPTS };
  }
}
