import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/app/config/api"
import type { RootState } from "../store"


export const attendancesApi = createApi({
  reducerPath: "attendancesApi",
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
    addAttendance: builder.mutation<any, any>({
      query: (attendance) => ({
        url: "/attendance",
        method: "POST",
        body: attendance,
      }),
    }),

    getAttendance: builder.query<any, void>({
      query: () => "/attendance",
    }),

  }),
})

export const {
  useAddAttendanceMutation,
  useGetAttendanceQuery
} = attendancesApi

