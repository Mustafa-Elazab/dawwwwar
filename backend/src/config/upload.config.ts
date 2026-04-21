import { registerAs } from '@nestjs/config';

export const uploadConfig = registerAs('upload', () => ({
  // Cloudflare R2 endpoint format: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  // AWS S3 endpoint: leave empty (SDK uses default)
  endpoint: process.env.S3_ENDPOINT ?? '',
  region: process.env.AWS_REGION ?? 'auto',     // R2 uses 'auto'
  bucketName: process.env.AWS_BUCKET_NAME ?? 'dawwar-uploads',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  publicBaseUrl: process.env.UPLOAD_PUBLIC_BASE_URL ?? '',
  maxFileSizeBytes: 10 * 1024 * 1024,            // 10 MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/m4a',
    'audio/mpeg',
    'audio/mp4',
    'audio/aac',
  ],
}));
