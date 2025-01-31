import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES, handleAPIError } from "../../config/api"
import type { RootState } from "../store"
import type { Student, Center, Group, AttendanceRecord, ExamRecord, AttendanceReport } from "../../types"

export const studentsApi = createApi({
  reducerPath: "studentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Students", "Centers", "Groups", "Attendance", "Exams"],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => ({
        url: API_ROUTES.STUDENTS,
        method: "GET",
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: ["Students"],
    }),
    getStudent: builder.query<Student, number>({
      query: (id) => API_ROUTES.STUDENT(id),
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: (_result, _error, id) => [{ type: "Students", id }],
    }),
    createStudent: builder.mutation<Student, Omit<Student, "id" | "center_name" | "group_name" | "attendance_records">>(
      {
        query: (student) => ({
          url: API_ROUTES.STUDENTS,
          method: "POST",
          body: student,
        }),
        transformErrorResponse: (response) => handleAPIError(response),
        invalidatesTags: ["Students"],
      },
    ),
    updateStudent: builder.mutation<Student, Partial<Student> & { id: number }>({
      query: ({ id, ...student }) => ({
        url: API_ROUTES.STUDENT(id),
        method: "PUT",
        body: student,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Students", id }],
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ROUTES.STUDENT(id),
        method: "DELETE",
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Students"],
    }),
    getCenters: builder.query<Center[], void>({
      query: () => API_ROUTES.CENTERS,
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: ["Centers"],
    }),
    getGroups: builder.query<Group[], void>({
      query: () => API_ROUTES.GROUPS,
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: ["Groups"],
    }),
    getAttendance: builder.query<AttendanceRecord[], { student_id: string }>({
      query: ({ student_id }) => `${API_ROUTES.ATTENDANCE}?student_id=${student_id}`,
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: (_result, _error, { student_id }) => [{ type: "Attendance", id: student_id }],
    }),
    getExams: builder.query<ExamRecord[], { student_id: string }>({
      query: ({ student_id }) => `${API_ROUTES.Exams}?student_id=${student_id}`,
      transformErrorResponse: (response) => handleAPIError(response),
      providesTags: (_result, _error, { student_id }) => [{ type: "Exams", id: student_id }],
    }),
    handleAttendance: builder.mutation<
      { message: string; warning?: boolean },
      {
        action: "start_recording" | "mark_attended" | "mark_absent" | "mark_excused" | "end_recording"
        group_id: string
        week_id: string
        student_id?: string
        excuse_reason?: string
      }
    >({
      query: (body) => ({
        url: API_ROUTES.ATTENDANCE,
        method: "POST",
        body,
      }),
      transformErrorResponse: (response) => handleAPIError(response),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceReport: builder.query<AttendanceReport, { groupId: string; date: string }>({
      query: ({ groupId, date }) => `${API_ROUTES.ATTENDANCE}?group_id=${groupId}&date=${date}`,
      transformErrorResponse: (response) => handleAPIError(response),
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetCentersQuery,
  useGetGroupsQuery,
  useGetAttendanceQuery,
  useGetExamsQuery,
  useHandleAttendanceMutation,
  useGetAttendanceReportQuery,
} = studentsApi

