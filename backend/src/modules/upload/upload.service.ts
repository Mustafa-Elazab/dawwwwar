import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';

export interface PresignedUrlRequest {
  filename: string;
  mimeType: string;
  folder: 'products' | 'orders' | 'receipts' | 'voice' | 'profiles';
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

@Injectable()
export class UploadService {
  private readonly allowedMimeTypes: string[];
  private readonly maxFileSize: number;

  constructor(
    private readonly s3: S3Service,
    private readonly config: ConfigService,
  ) {
    this.allowedMimeTypes =
      this.config.get<string[]>('upload.allowedMimeTypes') ?? [];
    this.maxFileSize =
      this.config.get<number>('upload.maxFileSizeBytes') ?? 10 * 1024 * 1024;
  }

  /**
   * Direct upload — backend receives file, sends to S3.
   * Used for smaller files (receipts, profile photos).
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<{ url: string }> {
    this.validateFile(file);

    const url = await this.s3.uploadBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder,
    );

    return { url };
  }

  /**
   * Presigned URL — mobile uploads directly to S3.
   * Better for larger files (voice notes, many product images).
   * Mobile app:
   *   1. POST /upload/presign → gets uploadUrl + fileUrl
   *   2. PUT uploadUrl (with file binary) directly to S3
   *   3. Use fileUrl in order payload
   */
  async getPresignedUrl(
    dto: PresignedUrlRequest,
  ): Promise<PresignedUrlResponse> {
    if (!this.allowedMimeTypes.includes(dto.mimeType)) {
      throw new BadRequestException(
        `File type not allowed: ${dto.mimeType}`,
      );
    }

    return this.s3.getPresignedUploadUrl(
      dto.folder,
      dto.filename,
      dto.mimeType,
    );
  }

  private validateFile(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed: ${file.mimetype}`);
    }
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File too large: max ${this.maxFileSize / 1024 / 1024} MB`,
      );
    }
  }
}
