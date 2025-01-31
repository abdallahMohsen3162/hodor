"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { logout } from "@/app/redux/authSlice"
import { useLogoutMutation } from "@/app/redux/authApi"
import Image from "next/image"
import { useSidebar } from "@/contexts/SidebarContext"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()
  const router = useRouter()
  const [logoutMutation] = useLogoutMutation()
  const { toggleSidebar } = useSidebar()
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      
      if (token) {
        await logoutMutation().unwrap() // ✅ استدعاء API للخروج إذا كان التوكن موجودًا
      }
  
      dispatch(logout()) // ✅ تحديث Redux وحذف التوكن
      localStorage.clear() // ✅ حذف جميع البيانات المخزنة محليًا
      window.location.href = "/login" // ✅ إعادة التوجيه وإجبار إعادة تحميل الصفحة
  
    } catch (error) {
      console.error("❌ فشل تسجيل الخروج:", error)
    }
  }
  

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-primary/20">
              <Image src="/logo.png" alt="متابعة مستر أحمد الأمير" layout="fill" objectFit="cover" />
            </div>
            <h1 className="text-xl font-bold text-primary hidden md:block">متابعة مستر أحمد الأمير</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  )
}

