import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

// 基本 API 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL: "http://47.122.23.43:8080",
    timeout: 25000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      // 添加Token
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `${token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      // 全局处理报错
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

const http = createAxiosInstance();

// 定义请求参数
interface RequestParams {
  [key: string]: any;
}

// 统一请求模板格式
const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return http(config);
};

// GET请求
export const get = <T = any>(
  url: string,
  params?: RequestParams,
  config?: Omit<AxiosRequestConfig, "url" | "params" | "method">
): Promise<T> => {
  return request<T>({
    url,
    params,
    method: "GET",
    ...config,
  });
};

// POST请求
export const post = <T = any>(
  url: string,
  data?: RequestParams,
  config?: Omit<AxiosRequestConfig, "url" | "data" | "method">
): Promise<T> => {
  return request<T>({
    url,
    data,
    method: "POST",
    ...config,
  });
};

export default {
  get,
  post,
};
