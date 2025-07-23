import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import { apiFetch } from "@/api/apiFetch";

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
      headers: args.headers as HeadersInit,
    };
  }

  try {
    const data = await apiFetch(url, options);
    return { data };
  } catch (error: unknown) {
    const err = (error as Partial<{ status: number; data: unknown }>) || {};
    return {
      error: {
        status: err.status ?? 500,
        data: err.data ?? "Something went wrong",
      },
    };
  }
};
