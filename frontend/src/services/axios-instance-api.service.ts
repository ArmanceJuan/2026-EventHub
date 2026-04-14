import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const createAxiosInstance = (options: AxiosRequestConfig = {}) =>
  axios.create({
    baseURL,
    timeout: 8000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

export const axiosWithAuthApi = createAxiosInstance();
export const axiosWithoutAuthApi = createAxiosInstance();
