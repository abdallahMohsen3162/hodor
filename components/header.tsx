"use client"

import { Button } from "@/components/ui/button"
import { useLogoutMutation } from "@/app/redux/authApi"
import { useRouter } from "next/navigation"
import { LogOut, Menu } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export function Header() {
  const [logout] = useLogoutMutation()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
  
      if (!res.ok) throw new Error("Failed to logout")
  
      localStorage.removeItem("access_token") // ✅ حذف التوكن
      localStorage.removeItem("user") // ✅ حذف بيانات المستخدم
      window.location.href = "/login" // ✅ إعادة التوجيه إلى صفحة تسجيل الدخول
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold mr-4">حضور</h1>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="ml-2 h-4 w-4" />
        تسجيل الخروج
      </Button>
    </header>
  )
}

