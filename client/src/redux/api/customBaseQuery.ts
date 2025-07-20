import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import { apiFetch } from "@/api/apiFetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args) => {
  let url = "";
  let options: RequestInit = {};

  if (typeof args === "string") {
    url = args;
  } else {
    url = args.url;
    options = {
      method: args.method,
      body: args.body,
      headers: args.headers,
    };
  }

  try {
    const data = await apiFetch(`${BASE_URL}/${url}`, options);
    return { data };
  } catch (error: any) {
    return {
      error: {
        status: error.status || 500,
        data: error.data || "Something went wrong",
      },
    };
  }
};
