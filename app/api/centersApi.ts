import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES, handleAPIError } from "../config/api"
import type { Center } from "../types"
import type { RootState } from "../redux/store"

export const centersApi = createApi({
  reducerPath: "centersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Centers"],
  endpoints: (builder) => ({
    getCenters: builder.query<any, any>({
      query: () => API_ROUTES.CENTERS,
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: ["Centers"],
    }),
    addCenter: builder.mutation<any, any>({
      query: (center) => ({
        url: API_ROUTES.CENTERS,
        method: "POST",
        body: center,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Centers"],
    }),
    updateCenter: builder.mutation<any,any>({
      query: (center) => ({
        url: API_ROUTES.CENTER(center.id!),
        method: "PUT",
        body: center,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Centers", id }],
    }),
    deleteCenter: builder.mutation<any, any>({
      query: (id) => ({
        url: API_ROUTES.CENTER(id),
        method: "DELETE",
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Centers"],
    }),
  }),
})

export const { useGetCentersQuery, useAddCenterMutation, useUpdateCenterMutation, useDeleteCenterMutation } = centersApi

