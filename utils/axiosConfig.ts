import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getToken } from "./secureStore";

export const mainApi = axios.create({
  baseURL: "https://api.cloudwavproduction.com/api",
  withCredentials: false,
});

mainApi.interceptors.request.use(async (config) => {
  const token = await getToken("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // For FormData, ensure Content-Type is set to multipart/form-data
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
      console.log("FormData request detected:", {
        url: config.url,
        method: config.method,
        hasContentType: !!config.headers["Content-Type"],
        contentType: config.headers["Content-Type"],
        originalHeaders: config.headers
      });
    }
  }

  // Mark logout requests for special handling
  if (config.url?.includes("/logout")) {
    (config as any).metadata = { isLogoutRequest: true };
  }

  return config;
});

// Add response interceptor for debugging
mainApi.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

export const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: "" }) =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
  }) => {
    try {
      const result = await mainApi({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      // Check if this is a logout request
      const isLogoutRequest = (err.config as any)?.metadata?.isLogoutRequest;

      if (err.response?.status === 401) {
        await AsyncStorage.removeItem("token");

        // For logout requests, don't log session expired message
        if (!isLogoutRequest) {
          console.warn("Session expired, redirecting to login...");
        }
      }

      // For logout requests with 401, return success instead of error
      if (isLogoutRequest && err.response?.status === 401) {
        return { data: { success: true } };
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
