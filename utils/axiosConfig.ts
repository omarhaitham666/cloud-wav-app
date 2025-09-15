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
    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    // For FormData, let axios set the Content-Type with boundary
  }
  
  // Mark logout requests for special handling
  if (config.url?.includes('/logout')) {
    config.metadata = { isLogoutRequest: true };
  }
  
  return config;
});

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
