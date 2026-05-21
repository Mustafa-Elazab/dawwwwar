// ── Auth Domain ─────────────────────────────────────────────
export { authApi } from './api';
export { useSendOtp, useVerifyOtp } from './hooks';
export type { User as AuthEntity } from './entity';
export type { SendOtpResponse, VerifyOtpResponse } from './response';
