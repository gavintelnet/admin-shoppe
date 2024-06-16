// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import axios, { AxiosRequestConfig, Method } from "axios";
const axiosInstance = axios.create({
  timeout: 60000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const userToken = JSON.parse(localStorage.getItem("user_token"));
    const token = JSON.parse(localStorage.getItem("user_token"));
    let tokenWithoutQuotes = token && token?.replace(/"/g, "");
    if (token && tokenWithoutQuotes) {
      config.headers.Authorization = `Bearer ${tokenWithoutQuotes}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message) {
      // message.success(response.data.message);
    }

    return {
      status: true,
      message: response?.data?.message || "success",
      result: response.data.data,
    };
  },
  (error) => {
    console.log(error);
    let errorMessage = "Lỗi hệ thống";
    if (error?.message?.includes("Network Error")) {
      errorMessage = "";
    } else if (error?.response?.status === 401) {
      window.localStorage.clear();
      window.location.href = "/login";
    } else if (error?.response?.status === 400) {
      errorMessage = error?.response?.data?.message;

      if (errorMessage === "Json Web Token is Expired, Try again ") {
        window.localStorage.clear();
      } else {
        return {
          status: false,
          message: errorMessage,
          result: null,
        };
      }
    } else if (error?.response?.status === 404 || 502) {
      errorMessage = error?.response?.data?.message;
      return {
        status: false,
        message: "Lỗi hệ thống",
        result: null,
      };
    } else {
      return Promise.reject(error);
    }
  }
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

export type MyResponse<T = any> = Promise<Response<T>>;
/**
 *
 * @param method
 * @param url
 * @param data
 */

export const request = <T = any>(
  method: Lowercase<Method>,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = "";

  url = prefix + url;

  if (method === "post") {
    return axiosInstance.post(url, data, config);
  } else if (method === "delete") {
    return axiosInstance.delete(url);
  } else if (method === "put") {
    return axiosInstance.put(url, data, config);
  } else {
    return axiosInstance.get(url, {
      params: data,
      ...config,
    });
  }
};
