"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Footer } from "@/components/footer"
import { NetworkIndicator } from "@/components/network-indicator"
import { ErrorBoundary } from "@/components/error-boundary"
import type { RootState } from "@/app/redux/store"
import { checkAPIConnection } from "@/app/config/api"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useValidateTokenQuery } from "@/app/redux/authApi"
import { setTokenValidity, logout } from "@/app/redux/authSlice"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.auth.token)
  const { toast } = useToast()
  const [apiConnected, setApiConnected] = useState(true)

  const { data: tokenValidation, error: tokenValidationError, isLoading: tokenCheckLoading } = useValidateTokenQuery(undefined, {
    skip: !token,
  })

  // ✅ التحقق من صحة التوكن قبل إعادة التوجيه
  useEffect(() => {
    if (!token) {
      console.log("🔹 لا يوجد توكن، يتم إعادة التوجيه إلى صفحة تسجيل الدخول")
      router.replace("/login")
    } else if (tokenValidation && !tokenValidation.isValid) {
      console.log("❌ التوكن غير صالح، يتم تسجيل الخروج...")
      dispatch(logout()) // ✅ إزالة التوكن من Redux
      router.replace("/login")
    }
  }, [token, tokenValidation, dispatch, router])

  // ✅ التحقق من اتصال السيرفر وعرض تنبيه عند انقطاع الاتصال
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkAPIConnection()
      setApiConnected(isConnected)
      if (!isConnected) {
        toast({
          title: "خطأ في الاتصال",
          description: "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
          variant: "destructive",
        })
      }
    }

    checkConnection()
    const intervalId = setInterval(checkConnection, 30000) // ✅ فحص الاتصال كل 30 ثانية
    return () => clearInterval(intervalId)
  }, [toast])

  // ✅ منع تحميل الصفحة إذا لم يكن هناك توكن (تجنب الصفحة البيضاء)
  if (tokenCheckLoading) {
    return <div className="flex justify-center items-center h-screen text-lg font-bold">جارٍ التحقق من المصادقة...</div>
  }

  if (!token) {
    return <div className="flex justify-center items-center h-screen text-lg font-bold">جارٍ إعادة التوجيه...</div>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            <DashboardSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <DashboardHeader />
              <main className="flex-1 overflow-auto p-6 relative" lang="ar" dir="rtl">
                {!apiConnected && (
                  <Alert variant="destructive" className="mb-4 glass-effect">
                    <AlertTitle>خطأ في الاتصال</AlertTitle>
                    <AlertDescription>
                      تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                        إعادة المحاولة
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="max-w-7xl mx-auto">
                  <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover-lift">
                    {children}
                  </div>
                </div>
              </main>
              <Footer />
              <NetworkIndicator />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
