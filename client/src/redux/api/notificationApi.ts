import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (userId) => `/notifications/${userId}`,
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const { useGetNotificationsQuery, useDeleteNotificationMutation } =
  notificationApi;
