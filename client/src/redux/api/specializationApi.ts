import { createApi } from "@reduxjs/toolkit/query/react"; // add `/react`
import { customBaseQuery } from "./customBaseQuery";

export const specializationApi = createApi({
  reducerPath: "specializationApi",
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getSpecialization: build.query({
      query: () => "/specialization/get-all-specialization",
    }),
  }),
});

// Correct hook name based on endpoint name:
export const { useGetSpecializationQuery } = specializationApi;
