import { useMutation } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';

export function useUploadFile() {
  const { upload } = useApiClient();
  return useMutation({
    mutationFn: (file: any) => upload.uploadFile(file),
  });
}

export function useUploadFiles() {
  const { upload } = useApiClient();
  return useMutation({
    mutationFn: (files: any[]) => upload.uploadFiles(files),
  });
}
