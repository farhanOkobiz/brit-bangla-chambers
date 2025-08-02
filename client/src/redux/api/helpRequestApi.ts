import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

// Define a service using a base URL and expected endpoints
export const helpRequestApi = createApi({
  reducerPath: "helpRequestApi",
  baseQuery: customBaseQuery,
  tagTypes: ["HelpRequest"],
  endpoints: (build) => ({
    createHelpRequest: build.mutation({
      query: (formData) => ({
        url: "/support",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["HelpRequest"],
    }),
    getMyHelpRequests: build.query({
      query: () => "/support/my-requests",
      providesTags: ["HelpRequest"],
    }),
    getAllHelpRequests: build.query({
      query: () => "/support",
      providesTags: ["HelpRequest"],
    }),
    getHelpRequestById: build.query({
      query: (id) => `/support/${id}`,
      providesTags: ["HelpRequest"],
    }),
    updateHelpRequestStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/support/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["HelpRequest"],
    }),
    deleteHelpRequest: build.mutation({
      query: (id) => ({
        url: `/support/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HelpRequest"],
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateHelpRequestMutation,
    useGetMyHelpRequestsQuery,
    useGetAllHelpRequestsQuery,
    useGetHelpRequestByIdQuery,
    useUpdateHelpRequestStatusMutation,
    useDeleteHelpRequestMutation,
} = helpRequestApi;