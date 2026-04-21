import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'crypto';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('upload.endpoint');
    const region = this.config.get<string>('upload.region') ?? 'auto';

    this.s3 = new S3Client({
      region,
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId: this.config.get<string>('upload.accessKeyId') ?? '',
        secretAccessKey: this.config.get<string>('upload.secretAccessKey') ?? '',
      },
      forcePathStyle: !!endpoint,  // required for R2 / MinIO
    });

    this.bucket = this.config.get<string>('upload.bucketName') ?? 'dawwar-uploads';
    this.publicBaseUrl = this.config.get<string>('upload.publicBaseUrl') ?? '';
  }

  /**
   * Upload a file buffer directly.
   * Returns the public URL of the uploaded file.
   */
  async uploadBuffer(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'uploads',
  ): Promise<string> {
    const ext = originalName.split('.').pop() ?? 'bin';
    const hash = createHash('sha256')
      .update(buffer)
      .digest('hex')
      .slice(0, 12);
    const key = `${folder}/${Date.now()}-${hash}.${ext}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimeType,
          CacheControl: 'public, max-age=31536000',   // 1 year cache
        }),
      );
      return `${this.publicBaseUrl}/${key}`;
    } catch (err) {
      this.logger.error(`S3 upload failed for ${key}:`, err);
      // Graceful fallback — return placeholder so app doesn't crash
      return `https://placehold.co/400x400/FF6B35/white?text=Upload+Failed`;
    }
  }

  /**
   * Generate a presigned URL for direct upload from mobile client.
   * Expires in 15 minutes.
   */
  async getPresignedUploadUrl(
    folder: string,
    filename: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
    const ext = filename.split('.').pop() ?? 'bin';
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    const fileUrl = `${this.publicBaseUrl}/${key}`;

    return { uploadUrl, fileUrl, key };
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
    } catch (err) {
      this.logger.error(`S3 delete failed for ${key}:`, err);
    }
  }
}
