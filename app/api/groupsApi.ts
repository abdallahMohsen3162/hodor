import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES, handleAPIError } from "../config/api"
import type { Group } from "../types"
import type { RootState } from "../redux/store"

export const groupsApi = createApi({
  reducerPath: "groupsApi",
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
  tagTypes: ["Groups"],
  endpoints: (builder) => ({
    getGroups: builder.query<Group[], { centerId?: string; academicYear?: string }>({
      query: (params = {}) => {
        const { centerId, academicYear } = params
        const url = API_ROUTES.GROUPS
        const queryParams = new URLSearchParams()
        if (centerId) queryParams.append("center_id", centerId)
        if (academicYear) queryParams.append("academic_year", academicYear)
        const queryString = queryParams.toString()
        return queryString ? `${url}?${queryString}` : url
      },
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: ["Groups"],
    }),
    addGroup: builder.mutation<Group, Partial<Group>>({
      query: (group) => ({
        url: API_ROUTES.GROUPS,
        method: "POST",
        body: group,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Groups"],
    }),
    updateGroup: builder.mutation<Group, Partial<Group>>({
      query: (group) => ({
        url: API_ROUTES.GROUP(group.id!),
        method: "PUT",
        body: group,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Groups", id }],
    }),
    deleteGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ROUTES.GROUP(id),
        method: "DELETE",
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Groups"],
    }),
  }),
})

export const { useGetGroupsQuery, useAddGroupMutation, useUpdateGroupMutation, useDeleteGroupMutation } = groupsApi

