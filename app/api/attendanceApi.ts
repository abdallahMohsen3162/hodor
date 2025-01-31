import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, handleAPIError } from "../config/api";
import type { RootState } from "../redux/store";
import type { AttendanceRecord, AttendanceSession, AttendanceReport, StudyWeek, AttendanceUpdateResponse } from "../types";

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
  tagTypes: ["Attendance", "Weeks", "Stats"],
  // group_id=1&week_id&academic_year=12
  endpoints: (builder) => ({
    getAttendance: builder.query<AttendanceRecord[], { weekId: string; groupId: string; academic_year?: string }>({
      query: ({ weekId, groupId, academic_year }) =>
        `/attendance?week_id=${weekId}&group_id=${groupId}${academic_year ? `&academic_year=${academic_year}` : ""}`,
      providesTags: ["Attendance"],
    }),
    startAttendanceSession: builder.mutation<AttendanceSession, { groupId: string; weekId: string }>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body: { ...body, action: "start_recording" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    endAttendanceSession: builder.mutation<void, { groupId: string; weekId: string }>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body: { ...body, action: "end_recording" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    markAttendance: builder.mutation<void, { studentId: string; groupId: string; weekId: string; status: string }>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body: { ...body, action: "mark_attended" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    markExcused: builder.mutation<void, { studentId: string; groupId: string; weekId: string; excuseReason: string }>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body: { ...body, action: "mark_excused" },
      }),
      invalidatesTags: ["Attendance"],
    }),
    getWeeks: builder.query<StudyWeek[], void>({
      query: () => "/get_weeks",
      providesTags: ["Weeks"],
    }),
    addWeek: builder.mutation<StudyWeek, { name: string; startDate: string; endDate: string }>({
      query: (body) => ({
        url: "/add_week",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Weeks"],
    }),
    getStats: builder.query<{ count: number; attendanceRate: number; groupsCount: number }, { type: string; groupId?: string; weekId?: string }>({
      query: ({ type, groupId, weekId }) =>
        `/stats/${type}${groupId ? `?group_id=${groupId}` : ""}${weekId ? `&week_id=${weekId}` : ""}`,
      providesTags: ["Stats"],
    }),
    updateAttendance: builder.mutation<AttendanceUpdateResponse, { attendanceId: number; action: string; status?: string }>({
      query: ({ attendanceId, action, status }) => ({
        url: `/update_attendance/${attendanceId}`,
        method: "POST",
        body: { action, status },
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useStartAttendanceSessionMutation,
  useEndAttendanceSessionMutation,
  useMarkAttendanceMutation,
  useMarkExcusedMutation,
  useGetWeeksQuery,
  useAddWeekMutation,
  useGetStatsQuery,
  useUpdateAttendanceMutation,
} = attendanceApi;

