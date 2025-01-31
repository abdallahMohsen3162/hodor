"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useGetStudentsQuery } from "@/app/redux/features/studentsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Overview() {
  const { data: students, isLoading, error } = useGetStudentsQuery()
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([])

  useEffect(() => {
    if (students) {
      const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
      const data = daysOfWeek.map((day) => ({
        name: day,
        total: Math.floor(Math.random() * 100), // Replace with actual data when available
      }))
      setChartData(data)
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
        <CardTitle>نظرة عامة</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

