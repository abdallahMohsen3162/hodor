"use client"

import { useGetExamsQuery } from "@/app/redux/features/studentsApi"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDate } from "@/lib/utils"

export function StudentExams({ studentId }: { studentId: string }) {
  const { data: exams, isLoading, error } = useGetExamsQuery({ student_id: studentId })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات الامتحانات. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  if (!exams || exams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>الامتحانات</CardTitle>
        </CardHeader>
        <CardContent>
          <p>لا توجد امتحانات مسجلة لهذا الطالب.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الامتحانات</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المادة</TableHead>
              <TableHead>الدرجة</TableHead>
              <TableHead>الدرجة الكلية</TableHead>
              <TableHead>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.subject}</TableCell>
                <TableCell>{exam.score}</TableCell>
                <TableCell>{exam.total_score}</TableCell>
                <TableCell>{formatDate(exam.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

