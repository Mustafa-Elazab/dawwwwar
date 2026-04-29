import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios from 'axios';

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
      await this.sendViaSms(phone, code);
    }

    return { expiresIn: expiresSeconds };
  }

  // ── Verifyway SMS (P3-01) ─────────────────────────────────────────
  private async sendViaSms(phone: string, code: string): Promise<void> {
    const apiKey = this.config.get<string>('app.verifywayApiKey');
    const baseUrl = this.config.get<string>('app.verifywayBaseUrl');

    if (!apiKey) {
      // No API key configured — log and continue (sandbox should handle dev)
      this.logger.warn(`[OTP] VERIFYWAY_API_KEY not set — OTP for ${phone}: ${code}`);
      return;
    }

    const intlPhone = `+20${phone.replace(/^0/, '')}`;

    try {
      await axios.post(
        `${baseUrl}/send-otp`,
        {
          phone: intlPhone,
          message: `دوّار — رمز التحقق الخاص بك هو: ${code}. صالح لمدة دقيقتين.`,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000,
        },
      );
      this.logger.log(`OTP sent to ${phone} via Verifyway`);
    } catch (err: unknown) {
      // Never block auth flow — log and continue
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Verifyway SMS failed for ${phone}: ${msg}`);
      // Store SMS_SERVICE_UNAVAILABLE marker so mobile can handle gracefully
      const key = `otp:${phone}`;
      const existing = await this.cache.get<string>(key);
      if (existing) {
        const data = JSON.parse(existing) as { code: string; attempts: number; smsError?: boolean };
        data.smsError = true;
        const expiresSeconds = this.config.get<number>('app.otpExpiresSeconds') ?? 120;
        await this.cache.set(key, JSON.stringify(data), expiresSeconds * 1000);
      }
    }
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
