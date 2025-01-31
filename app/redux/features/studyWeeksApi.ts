import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_BASE_URL, API_ROUTES } from "../../config/api"
import type { RootState } from "../store"

interface StudyWeek {
  id: number
  name: string
  start_date: string // This will be a string in 'YYYY-MM-DD' format
  end_date: string // This will be a string in 'YYYY-MM-DD' format
}

export const studyWeeksApi = createApi({
  reducerPath: "studyWeeksApi",
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
  tagTypes: ["StudyWeeks"],
  endpoints: (builder) => ({
    getStudyWeeks: builder.query<StudyWeek[], void>({
      query: () => API_ROUTES.GET_WEEKS,
      providesTags: ["StudyWeeks"],
    }),
    addStudyWeek: builder.mutation<StudyWeek, Omit<StudyWeek, "id">>({
      query: (weekData) => ({
        url: "/add_week",
        method: "POST",
        body: weekData,
      }),
      invalidatesTags: ["StudyWeeks"],
    }),
  }),
})

export const { useGetStudyWeeksQuery, useAddStudyWeekMutation } = studyWeeksApi

