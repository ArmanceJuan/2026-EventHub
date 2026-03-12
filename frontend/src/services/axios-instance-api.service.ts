import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:8000";

const createAxiosInstance = (options: AxiosRequestConfig = {}) =>
  axios.create({
    baseURL,
    timeout: 8000,
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

export const axiosWithAuthApi = createAxiosInstance();
export const axiosWithoutAuthApi = createAxiosInstance();
