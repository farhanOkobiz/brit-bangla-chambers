import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
// import type { Pokemon } from "./types";

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getBlogs: build.query({
      query: () => "blog/get-all-blog",
    }),
    getSingleBlog: build.query({
      query: (id) => `blog/get-single-blog/${id}`,
    }),
    getBlogPublished: build.query({
      query: () => `blog/get-blog-published/`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBlogsQuery,
  useGetSingleBlogQuery,
  useGetBlogPublishedQuery,
} = blogApi;
