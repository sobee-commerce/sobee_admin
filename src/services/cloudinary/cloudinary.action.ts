'use server';

import {API_ROUTES, ENV_CONFIG} from '@/constants';
import {UploadFileFormSchema, UploadUrlFormSchema} from '@/lib/form-schema';
import {FETCH} from '@/services';
import {cookies} from 'next/headers';

export const uploadFileAction = async (payload: UploadFileFormSchema) => {
  const {files, resourceType, folder} = payload;
  const formData = new FormData();
  switch (true) {
    case files instanceof File:
      formData.append('files', files);
      break;
    default:
      files.forEach(file => {
        formData.append('files', file);
      });
      break;
  }

  formData.append('upload_preset', ENV_CONFIG.CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder as string);
  formData.append('resourceType', resourceType as string);
  const res = await FETCH.post<
    any,
    {
      urls: string[];
    }
  >(API_ROUTES.UPLOAD.UPLOAD_FILE, formData, {
    cookies,
  });
  return res;
};

export const uploadUrlAction = async (payload: UploadUrlFormSchema) => {
  const {url, folder, resourceType} = payload;
  const formData = new FormData();
  formData.append('url', url);
  formData.append('upload_preset', ENV_CONFIG.CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder as string);
  formData.append('resourceType', resourceType as string);
  const res = await FETCH.post<
    any,
    {
      urls: string[];
    }
  >(API_ROUTES.UPLOAD.UPLOAD_URL, formData, {
    cookies,
  });
  return res;
};
