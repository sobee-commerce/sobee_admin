import {UploadFileFormSchema, UploadUrlFormSchema} from '@/lib/form-schema';
import {useMutation} from '@tanstack/react-query';
import {uploadFileAction, uploadUrlAction} from './cloudinary.action';

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: async (payload: UploadFileFormSchema) =>
      await uploadFileAction(payload),
  });
};

export const useUploadUrlMutation = () => {
  return useMutation({
    mutationFn: async (payload: UploadUrlFormSchema) =>
      await uploadUrlAction(payload),
  });
};
