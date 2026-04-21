import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3Service } from './s3.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),  // files held in RAM buffer, sent to S3 directly
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, S3Service],
  exports: [UploadService, S3Service],
})
export class UploadModule {}
