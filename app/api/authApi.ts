import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES, handleAPIError } from "../config/api"
import type { RootState } from "../redux/store"

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  message: string
  access_token: string
  user: {
    id: number
    username: string
  }
}

export const authApi = createApi({
  reducerPath: "authApi",
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
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ROUTES.LOGIN,
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: API_ROUTES.LOGOUT,
        method: "POST",
      }),
      transformErrorResponse: (response) => handleAPIError(response),
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi

