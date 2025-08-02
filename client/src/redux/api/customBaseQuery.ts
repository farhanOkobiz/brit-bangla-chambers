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
    // Always set Content-Type for requests with a body
    const hasBody = !!args.body;
    options = {
      method: args.method,
      body:
        hasBody && typeof args.body === "object"
          ? JSON.stringify(args.body)
          : args.body,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(args.headers && typeof args.headers === "object" && !Array.isArray(args.headers)
          ? args.headers
          : {}),
      },
    };
  }

  try {
    const data = await apiFetch(
      `${url}`,
      options as RequestInit & { headers?: Record<string, string> }
    );
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
