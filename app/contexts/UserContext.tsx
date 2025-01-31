"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"

interface User {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      // Here you would typically fetch the user data from your API
      // For now, we'll just set a mock user
      setUser({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "teacher",
        permissions: ["view_dashboard", "view_students", "edit_attendance"],
      })
    } else {
      setUser(null)
    }
  }, [token])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

