import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL } from "@/app/config/api"
import type { RootState } from "../store"
import type { AttendanceRecord, StudyWeek } from "@/app/types"

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
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
  tagTypes: ["Attendance", "StudyWeeks"],
  endpoints: (builder) => ({
    // تسجيل حضور طالب
    markAttended: builder.mutation<{ message: string }, { student_id: number; group_id: number; week_id: number }>({
      query: (body) => ({
        url: '/attendance',
        method: 'POST',
        body: { action: 'mark_attended', ...body },
      }),
      invalidatesTags: ['Attendance'],
    }),



    getAttendance: builder.query<AttendanceRecord[], { group_id?: string; week_id?: string; }>({
      query: (params) => ({
        url: "/attendance",
        params,
      }),
      providesTags: ["Attendance"],
    }),
    
    handleAttendance: builder.mutation<
      { message: string; warning?: boolean },
      {
        action: "start_recording" | "mark_attended" | "mark_excused" | "end_recording"
        group_id: string
        week_id: string
        student_id?: string
        excuse_reason?: string
        date?: string
        ignore_group_mismatch?: boolean
      }
    >({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
    updateAttendance: builder.mutation<
      { message: string; attendance?: AttendanceRecord },
      { attendance_id: number; action: "update" | "delete"; status?: string }
    >({
      query: ({ attendance_id, ...body }) => ({
        url: `/update_attendance/${attendance_id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceRate: builder.query<{ attendance_rate: number }, { group_id?: string; week_id?: string }>({
      query: (params) => ({
        url: "/stats/attendance-rate",
        params,
      }),
    }),
    getStudyWeeks: builder.query<StudyWeek[], void>({
      query: () => "/get_weeks",
      providesTags: ["StudyWeeks"],
    }),
    addStudyWeek: builder.mutation<StudyWeek, { name: string; start_date: string; end_date: string }>({
      query: (body) => ({
        url: "/add_week",
        method: "POST",
        body,
      }),
      invalidatesTags: ["StudyWeeks"],
    }),
  }),
})

export const {
  useGetAttendanceQuery,
  useHandleAttendanceMutation,
  useUpdateAttendanceMutation,
  useGetAttendanceRateQuery,
  useGetStudyWeeksQuery,
  useAddStudyWeekMutation,
} = attendanceApi

