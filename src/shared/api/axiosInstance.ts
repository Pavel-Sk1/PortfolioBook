import axios from 'axios';
import type { ServerResponseType } from './server-response-type';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
console.log('axiosInstance', import.meta.env.VITE_API);

let accessToken = '';

export function setAccessToken(newAccessToken: string) {
  accessToken = newAccessToken;
}

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.authorization) {
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => { // если сервер УЖЕ вернул ServerResponseType — не трогаем
    if (
      response.data &&
      typeof response.data === 'object' &&
      'statusCode' in response.data &&
      'data' in response.data
    ) {
      return response
    }

    const wrapped: ServerResponseType<unknown> = {
      statusCode: response.status,
      message: response.statusText || '',
      data: response.data,
      error: null,
    }

    return { ...response, data: wrapped }},

  async (error) => {
    const prevRequest = error.config;

    if (error.response?.status === 403 && !prevRequest.sent) {
      const response = await axiosInstance.get('/auth/refreshTokens');
      const newAccessToken = response.data.data.accessToken;
      setAccessToken(newAccessToken);
      prevRequest.sent = true;
      prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  }
);