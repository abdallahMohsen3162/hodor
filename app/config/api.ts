export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const API_ROUTES = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  VALIDATE_TOKEN: "/validate-token",
  CENTERS: "/centers",
  CENTER: (id: number) => `/centers/${id}`,
  GROUPS: "/groups",
  GROUP: (id: number) => `/groups/${id}`,
  STUDENTS: "/students",
  STUDENT: (id: number) => `/students/${id}`,
  ATTENDANCE: "/attendance",
  ATTENDANCE_REPORT: "/attendance/report",  // Add the missing ATTENDANCE_REPORT route
  STUDY_WEEKS: "/study-weeks",
  ADD_WEEK: "/add_week",
  GET_WEEKS: "/get_weeks",
  Exams: "/exams",
  ATTENDANCE_STATS: "/stats/attendance-rate",
  UPDATE_ATTENDANCE: (id: number) => `/update_attendance/${id}`,
};

export const handleAPIError = (error: unknown) => {
  console.error("API Error:", error)
  if (error instanceof Error) {
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      return { error: "Network error. Please check your internet connection and try again." }
    }
    return { error: error.message }
  }
  return { error: "An unknown error occurred" }
}

export const checkAPIConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response.ok
  } catch (error) {
    console.error("API connection error:", error)
    return false
  }
}

