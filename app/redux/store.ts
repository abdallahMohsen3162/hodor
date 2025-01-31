import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { studentsApi } from "./features/studentsApi"
import { centersApi } from "./features/centersApi"
import { groupsApi } from "./features/groupsApi"
import { attendanceApi } from "./features/attendanceApi"
import { studyWeeksApi } from "./features/studyWeeksApi"
import { authApi } from "./authApi"
import authReducer from "./authSlice"
import { attendancesApi } from "./features/attendencesApi"




export const store = configureStore({
  reducer: {
    [studentsApi.reducerPath]: studentsApi.reducer,
    [centersApi.reducerPath]: centersApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [studyWeeksApi.reducerPath]: studyWeeksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [attendancesApi.reducerPath]: attendancesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ تعطيل فحص البيانات غير المتسلسلة لتحسين الأداء
      immutableCheck: false, // ✅ تعطيل التحقق من التعديلات غير الصحيحة لتسريع التطوير
    }).concat(
      studentsApi.middleware,
      centersApi.middleware,
      groupsApi.middleware,
      attendanceApi.middleware,
      studyWeeksApi.middleware,
      authApi.middleware,
      attendancesApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== "production", // ✅ تمكين Redux DevTools فقط أثناء التطوير
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
