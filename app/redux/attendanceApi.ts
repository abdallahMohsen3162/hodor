import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES } from "../config/api"
import type { RootState } from "./store"
import type { AttendanceRecord, AttendanceSession, AttendanceReport } from "../types"

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    getAttendance: builder.query<any, any>({
      query: (params) => {
        // ?group_id=1&week_id&academic_year=12
        const { group_id, week_id, academic_year } = params
        return `attendance?group_id=${group_id}&week_id=${week_id}${academic_year ? `&academic_year=${academic_year}` : ""}`
      },
      // providesTags: ["Attendance"],
    }),
    startAttendanceSession: builder.mutation<AttendanceSession, { groupId: string; date: string }>({
      query: (body) => ({
        url: API_ROUTES.ATTENDANCE,
        method: "POST",
        body: { ...body, action: "start_session" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    endAttendanceSession: builder.mutation<void, { sessionId: string }>({
      query: (body) => ({
        url: API_ROUTES.ATTENDANCE,
        method: "POST",
        body: { ...body, action: "end_session" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    markAttendance: builder.mutation<any, any>({
      query: (body) => ({
        url: API_ROUTES.ATTENDANCE,
        method: "POST",
        body: { ...body, action: "mark_attendance" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceReport: builder.query<any, any>({
      query: ({ groupId, startDate, endDate }) =>
        `${API_ROUTES.ATTENDANCE}/report?group_id=${groupId}&start_date=${startDate}&end_date=${endDate}`,
    }),
  }),
})

export const {
  useGetAttendanceQuery,
  useStartAttendanceSessionMutation,
  useEndAttendanceSessionMutation,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery,
} = attendanceApi

