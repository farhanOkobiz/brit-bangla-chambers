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
      headers:
        args.headers && typeof args.headers === "object" && !Array.isArray(args.headers)
          ? { ...args.headers } as Record<string, string>
          : undefined,
    };
  }

  try {
<<<<<<< HEAD
    const data = await apiFetch(`${url}`, options as RequestInit & { headers?: Record<string, string> });
=======
    const data = await apiFetch(url, options);
>>>>>>> raihan
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
