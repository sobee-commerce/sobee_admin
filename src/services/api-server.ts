import {COOKIES_KEY, ENV_CONFIG} from '@/constants';
import {ErrorResponse, SucccessResponse} from '@/lib/types';
import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';

type Options = {
  params?: Record<string, any>;
  body?: any;
  cookies?: () => ReadonlyRequestCookies;
} & RequestInit;

const _FETCH = async <T extends any>(
  url: string,
  options?: Options,
): Promise<SucccessResponse<T> | ErrorResponse<T>> => {
  const isFormData = options?.body instanceof FormData;
  const opts = {
    ...options,
    body: isFormData ? options?.body : JSON.stringify(options?.body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
  } as Options;

  //@ts-ignore
  isFormData && opts.headers && delete opts.headers['Content-Type'];

  try {
    const params = new URLSearchParams(opts.params);
    const apiUrl = url.startsWith('http')
      ? url
      : `${ENV_CONFIG.BASE_API_URL}${url}`;
    const res = await fetch(`${apiUrl}?${params.toString()}`, opts);
    const data = await res.json();
    return data as SucccessResponse<T>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? error?.message,
      statusCode: error?.response?.data?.statusCode ?? error?.status ?? 500,
    } as ErrorResponse<T>;
  }
};

const FETCH_WITH_TOKEN = async <T extends any>(
  url: string,
  options?: Options,
) => {
  const cookies = options?.cookies?.();
  const accessToken = cookies?.get(COOKIES_KEY.ACCESS_TOKEN_KEY);
  return await _FETCH<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: 'Bearer ' + accessToken?.value,
    } as HeadersInit,
  });
};

export const FETCH = {
  get: <T extends any>(url: string, options?: Options) =>
    FETCH_WITH_TOKEN<T>(url, {
      ...options,
      method: 'GET',
      cookies: options?.cookies,
    }),
  post: <T extends any, Y = {}>(url: string, data?: T, options?: Options) =>
    FETCH_WITH_TOKEN<Y>(url, {
      ...options,
      body: data as any,
      method: 'POST',
      cookies: options?.cookies,
    }),
  put: <T extends any, Y = {}>(url: string, data: T, options?: Options) =>
    FETCH_WITH_TOKEN<Y>(url, {
      ...options,
      body: data as any,
      method: 'PUT',
      cookies: options?.cookies,
    }),
  delete: <T extends any>(url: string, options?: Options) =>
    FETCH_WITH_TOKEN<T>(url, {
      ...options,
      method: 'DELETE',
      cookies: options?.cookies,
    }),
};
