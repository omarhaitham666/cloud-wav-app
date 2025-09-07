import { axiosBaseQuery } from "@/utils/axiosConfig";
import { createApi } from "@reduxjs/toolkit/query/react";

export const mainApi = createApi({
  reducerPath: "main-api",
  tagTypes: ["Songs", "Albums"],
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  endpoints: () => ({}),
});
