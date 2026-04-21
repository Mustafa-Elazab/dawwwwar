import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UploadService } from './upload.service';

class PresignDto {
  @ApiProperty({ example: 'photo.jpg' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  mimeType: string;

  @ApiProperty({ enum: ['products', 'orders', 'receipts', 'voice', 'profiles'] })
  @IsEnum(['products', 'orders', 'receipts', 'voice', 'profiles'])
  folder: 'products' | 'orders' | 'receipts' | 'voice' | 'profiles';
}

@ApiTags('Upload')
@Controller('upload')
@ApiBearerAuth('access-token')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Get a presigned URL for direct mobile-to-S3 upload.
   * Preferred method — avoids routing large files through the API server.
   */
  @Post('presign')
  @ApiOperation({ summary: 'Get presigned URL for direct S3 upload' })
  getPresignedUrl(@Body() dto: PresignDto) {
    return this.uploadService.getPresignedUrl(dto);
  }

  /**
   * Direct upload — multipart form, single file.
   * Use for receipts and profile photos (smaller files).
   */
  @Post('file')
  @ApiOperation({ summary: 'Upload single file directly' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', enum: ['products', 'orders', 'receipts', 'voice', 'profiles'] },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      storage: undefined, // use memory storage → buffer
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder = 'uploads',
  ) {
    return this.uploadService.uploadFile(file, folder);
  }

  /**
   * Direct upload — multipart form, multiple files (≤5).
   * Use for product images and custom order photos.
   */
  @Post('files')
  @ApiOperation({ summary: 'Upload multiple files (max 5)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: 10 * 1024 * 1024 } }))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder = 'uploads',
  ) {
    const results = await Promise.all(
      (files ?? []).map((file) => this.uploadService.uploadFile(file, folder)),
    );
    return { urls: results.map((r) => r.url) };
  }
}
