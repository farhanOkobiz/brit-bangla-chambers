import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getAuth: build.query({
      query: () => ({
        url: "auth/check",
        method: "GET",
      }),
    }),
    register: build.mutation({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),
    // You can add login, logout, etc. here
  }),
});

export const { useRegisterMutation, useGetAuthQuery } = authApi;