"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetStudentsQuery } from "@/app/redux/features/studentsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Activity {
  name: string
  email: string
  action: string
  date: string
}

export function RecentActivity() {
  const { data: students, isLoading, error } = useGetStudentsQuery()
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (students) {
      // This is a placeholder. In a real scenario, you'd fetch actual recent activities.
      const activities: Activity[] = students.slice(0, 5).map((student, index) => ({
        name: student.name,
        email: `student${index + 1}@example.com`,
        action: "تم تسجيل الحضور",
        date: "منذ قليل",
      }))
      setRecentActivities(activities)
    }
  }, [students])

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>النشاط الأخير</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
                <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mr-4 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
              </div>
              <div className="mr-auto text-sm text-muted-foreground">{activity.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

