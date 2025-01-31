"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/app/redux/authApi"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/app/redux/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login, { isLoading, error }] = useLoginMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({ username, password }).unwrap()

      // تخزين التوكن في localStorage
      localStorage.setItem("access_token", result.access_token)

      dispatch(setCredentials({ token: result.access_token, user: result.user }))
      console.log("Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (err) {
      console.error("Failed to login:", err)
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك والمحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="متابعة مستر أحمد الأمير"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">متابعة مستر أحمد الأمير</h1>
            <p className="text-muted-foreground">نظام إدارة الحضور الذكي</p>
          </div>

          <Card className="border-0 shadow-sm hover-lift">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-primary">تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border-input focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    كلمة المرور
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-input focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{(error as any)?.data?.message || "حدث خطأ أثناء تسجيل الدخول"}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
