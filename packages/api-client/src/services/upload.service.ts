import { AxiosInstance } from 'axios';
import { ApiResponse } from '@dawwar/types';

export class UploadService {
  constructor(private client: AxiosInstance) {}

  async uploadFile(file: any): Promise<ApiResponse<{ url: string }>> {
    const { data } = await this.client.post('/upload/file', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async uploadFiles(files: any[]): Promise<ApiResponse<{ urls: string[] }>> {
    const { data } = await this.client.post('/upload/files', files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
}
