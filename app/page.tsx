"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/redux/store"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function RootPage() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    if (token) {
      console.log("Token found, redirecting to dashboard")
      router.push("/dashboard")
    } else {
      console.log("No token found, redirecting to login")
      router.push("/login")
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

