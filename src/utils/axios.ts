import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

const axiosServices = axios.create({ baseURL: process.env.NEXT_APP_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

/**
 * Request interceptor to add Authorization token to request
 */

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
