"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Building2, UsersRound } from "lucide-react"
import { useGetStudentsQuery } from "@/app/redux/features/studentsApi"
import { useGetCentersQuery } from "@/app/redux/features/centersApi"
import { useGetGroupsQuery } from "@/app/redux/features/groupsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DashboardStatistics() {
  const { data: students, isLoading: isLoadingStudents, error: studentsError } = useGetStudentsQuery()
  const { data: centers, isLoading: isLoadingCenters, error: centersError } = useGetCentersQuery()
  const { data: groups, isLoading: isLoadingGroups, error: groupsError } = useGetGroupsQuery()

  if (isLoadingStudents || isLoadingCenters || isLoadingGroups) {
    return <LoadingSpinner />
  }

  if (studentsError || centersError || groupsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students?.length || 0}</div>
          <p className="text-xs text-muted-foreground">طالب مسجل</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المراكز النشطة</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{centers?.length || 0}</div>
          <p className="text-xs text-muted-foreground">مركز نشط</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">المجموعات النشطة</CardTitle>
          <UsersRound className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{groups?.length || 0}</div>
          <p className="text-xs text-muted-foreground">مجموعة نشطة</p>
        </CardContent>
      </Card>
    </div>
  )
}

