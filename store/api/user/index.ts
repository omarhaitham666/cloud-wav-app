import { axiosBaseQuery } from "@/utils/axiosConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user-api",
  tagTypes: ["Profile"],
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  endpoints: () => ({}),
  invalidationBehavior: "immediately",
  keepUnusedDataFor: 60 * 5, // 5 minutes
});
