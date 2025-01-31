import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES } from "../config/api"
import type { Student, AttendanceRecord, ExamRecord } from "../types"
import type { RootState } from "./store"

export const studentsApi = createApi({
  reducerPath: "studentsApi",
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
  tagTypes: ["Students", "Attendance", "Exams"],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => API_ROUTES.STUDENTS,
      providesTags: ["Students"],
    }),
    getStudent: builder.query<Student, number>({
      query: (id) => API_ROUTES.STUDENT(id),
      providesTags: (_result, _error, id) => [{ type: "Students", id }],
    }),
    createStudent: builder.mutation<Student, Omit<Student, "id" | "center_name" | "group_name" | "attendance_records">>(
      {
        query: (student) => ({
          url: API_ROUTES.STUDENTS,
          method: "POST",
          body: student,
        }),
        invalidatesTags: ["Students"],
      },
    ),
    updateStudent: builder.mutation<Student, Partial<Student> & { id: number }>({
      query: ({ id, ...student }) => ({
        url: API_ROUTES.STUDENT(id),
        method: "PUT",
        body: student,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Students", id }],
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ROUTES.STUDENT(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
    getAttendance: builder.query<AttendanceRecord[], { student_id: string }>({
      query: ({ student_id }) => `${API_ROUTES.ATTENDANCE}?student_id=${student_id}`,
      providesTags: (_result, _error, { student_id }) => [{ type: "Attendance", id: student_id }],
    }),
    getExams: builder.query<ExamRecord[], { student_id: string }>({
      query: ({ student_id }) => `${API_ROUTES.EXAMS}?student_id=${student_id}`,
      providesTags: (_result, _error, { student_id }) => [{ type: "Exams", id: student_id }],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetAttendanceQuery,
  useGetExamsQuery,
} = studentsApi

