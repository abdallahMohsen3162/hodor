import { createApi, fetchBaseQuery, FetchArgs } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES, handleAPIError } from "../config/api"
import type { RootState } from "./store"

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
      const state = getState() as RootState
      const token = state.auth.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
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
      transformErrorResponse: (response) => {
        console.error("❌ خطأ في تسجيل الدخول:", response)
        return handleAPIError(response)
      },
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => {
        return {
          url: API_ROUTES.LOGOUT,
          method: "POST",
        }
      },
      transformResponse: (response: { message: string }) => {
        console.log("✅ تسجيل الخروج ناجح:", response.message)
        return response
      },
      transformErrorResponse: (response) => {
        console.error("❌ خطأ في تسجيل الخروج:", response)
        return handleAPIError(response)
      },
    }),

    validateToken: builder.query<{ isValid: boolean }, void>({
      query: () => ({
        url: API_ROUTES.VALIDATE_TOKEN,
        method: "GET",
      }),
      transformErrorResponse: (response) => {
        console.error("❌ خطأ في التحقق من التوكن:", response)
        return handleAPIError(response)
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useValidateTokenQuery } = authApi
