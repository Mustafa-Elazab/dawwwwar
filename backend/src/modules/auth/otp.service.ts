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

  private formatPhone(phone: string): string {
    // Ensure Egyptian formatting for Akedly (starts with +20)
    let formatted = phone.replace(/\D/g, ''); // remove non-digits
    if (formatted.startsWith('0')) {
      formatted = '2' + formatted;
    }
    if (!formatted.startsWith('20')) {
      formatted = '20' + formatted;
    }
    return `+${formatted}`;
  }

  async sendOtp(phone: string): Promise<{ expiresIn: number }> {
    const isSandbox = this.config.get<boolean>('app.otpSandbox');
    const expiresSeconds = this.config.get<number>('app.otpExpiresSeconds') ?? 120;
    
    // Always store a dummy record for tracking attempts locally even if using Akedly
    const key = `otp:${phone}`;
    await this.cache.set(key, JSON.stringify({ attempts: 0 }), expiresSeconds * 1000);

    if (isSandbox) {
      this.logger.log(`[SANDBOX] OTP for ${phone}: 123456 (simulated via Akedly)`);
      // Simulating Akedly response locally, we store the code
      const sandboxCode = this.config.get<string>('app.otpSandboxCode') ?? '123456';
      await this.cache.set(key, JSON.stringify({ code: sandboxCode, attempts: 0 }), expiresSeconds * 1000);
      return { expiresIn: expiresSeconds };
    }

    try {
      const apiKey = this.config.get<string>('app.akedlyApiKey');
      const pipelineId = this.config.get<string>('app.akedlyPipelineId');

      if (!apiKey || !pipelineId) {
        this.logger.warn(`[OTP] AKEDLY config missing — skipping real OTP for ${phone}`);
        return { expiresIn: expiresSeconds };
      }

      // Step 1: Get challenge (anti-bot)
      const challengeRes = await axios.get('https://api.akedly.io/api/v1.2/transactions/challenge', {
        params: { APIKey: apiKey, pipelineID: pipelineId }
      });
      const challengeToken = challengeRes.data.challengeToken;
      const nonce = challengeRes.data.nonce;

      // Step 2: Send OTP
      const intlPhone = this.formatPhone(phone);
      await axios.post('https://api.akedly.io/api/v1.2/transactions/send', {
        APIKey: apiKey,
        pipelineID: pipelineId,
        verificationAddress: { phoneNumber: intlPhone },
        powSolution: { challengeToken, nonce }
      }, { timeout: 8000 });

      this.logger.log(`OTP sent to ${phone} via Akedly`);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Akedly OTP send failed for ${phone}: ${msg}`);
      // Don't crash auth flow, allow mock fallback or explicit error handling
    }

    return { expiresIn: expiresSeconds };
  }


  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<{ valid: boolean; remaining: number }> {
    const isSandbox = this.config.get<boolean>('app.otpSandbox');
    const MAX_ATTEMPTS = 5;
    const key = `otp:${phone}`;
    const raw = await this.cache.get<string>(key);

    const data = raw ? JSON.parse(raw) as { code?: string; attempts: number } : { attempts: 0 };

    if (data.attempts >= MAX_ATTEMPTS) {
      await this.cache.del(key);
      return { valid: false, remaining: 0 };
    }

    if (isSandbox) {
       const sandboxCode = data.code || this.config.get<string>('app.otpSandboxCode') || '123456';
       if (code !== sandboxCode) {
         data.attempts += 1;
         await this.cache.set(key, JSON.stringify(data), 120 * 1000);
         return { valid: false, remaining: MAX_ATTEMPTS - data.attempts };
       }
       await this.cache.del(key);
       return { valid: true, remaining: MAX_ATTEMPTS };
    }

    try {
      const apiKey = this.config.get<string>('app.akedlyApiKey');
      const pipelineId = this.config.get<string>('app.akedlyPipelineId');

      if (!apiKey || !pipelineId) {
        this.logger.warn(`[OTP] AKEDLY config missing — auto-passing verify for ${phone}`);
        return { valid: true, remaining: MAX_ATTEMPTS };
      }

      await axios.post('https://api.akedly.io/api/v1.2/transactions/verify', {
        APIKey: apiKey,
        pipelineID: pipelineId,
        otp: code
      }, { timeout: 8000 });

      // Verification success
      await this.cache.del(key);
      return { valid: true, remaining: MAX_ATTEMPTS };
    } catch (err: any) {
      // Akedly returns 400 for invalid OTP usually
      this.logger.error(`Akedly OTP verify failed for ${phone}:`, err?.response?.data || err.message);
      
      data.attempts += 1;
      await this.cache.set(key, JSON.stringify(data), 120 * 1000);
      return { valid: false, remaining: MAX_ATTEMPTS - data.attempts };
    }
  }
}
