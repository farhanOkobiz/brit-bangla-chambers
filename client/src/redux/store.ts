import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { blogApi } from "./api/blogApi";
import { authApi } from "./api/authApi";
import { specializationApi } from "./api/specializationApi";
import { notificationApi } from "./api/notificationApi";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [specializationApi.reducerPath]: specializationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      blogApi.middleware,
      authApi.middleware,
      specializationApi.middleware,
      notificationApi.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
