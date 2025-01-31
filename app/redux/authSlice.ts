import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { setCookie, deleteCookie } from "cookies-next"

interface AuthState {
  token: string | null
  user: {
    id: number
    username: string
  } | null
  isTokenValid: boolean
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  isTokenValid: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: AuthState["user"] }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      state.isTokenValid = true
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
        setCookie("token", action.payload.token, { maxAge: 30 * 24 * 60 * 60 }) // تخزين التوكن في الكوكيز
      }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isTokenValid = false
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        deleteCookie("token")
        window.location.href = "/login" // ✅ إعادة التوجيه بعد تسجيل الخروج
      }
    },
    setTokenValidity: (state, action: PayloadAction<boolean>) => {
      state.isTokenValid = action.payload
    },
  },
})

export const { setCredentials, logout, setTokenValidity } = authSlice.actions
export default authSlice.reducer
