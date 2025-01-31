"use client"

import { useState } from "react"
import { useGetStudentQuery, useGetAttendanceQuery, useGetExamsQuery } from "@/app/redux/features/studentsApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAcademicYearLabel } from "@/utils/academicYearUtils"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Image from "next/image"

interface StudentDetailsProps {
  studentId: string
}

export function StudentDetails({ studentId }: StudentDetailsProps) {
  const [activeTab, setActiveTab] = useState<"attendance" | "exams">("attendance")
  const { data: student, isLoading: isLoadingStudent, error: studentError } = useGetStudentQuery(Number(studentId))
  const {
    data: attendance,
    isLoading: isLoadingAttendance,
    error: attendanceError,
  } = useGetAttendanceQuery({ student_id: studentId })
  const { data: exams, isLoading: isLoadingExams, error: examsError } = useGetExamsQuery({ student_id: studentId })

  if (isLoadingStudent || isLoadingAttendance) return <LoadingSpinner />

  if (studentError || attendanceError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات الطالب. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  if (!student) return null

  const sendWhatsAppMessage = (record: any, type: "attendance" | "exam") => {
    const parentPhone = student.parents[0]?.phone
    if (!parentPhone) return

    let message = ""
    if (type === "attendance") {
      message = `سجل حضور الطالب ${student.name}: التاريخ ${new Date(record.date).toLocaleDateString("ar-EG")}، الحالة: ${record.status}`
    } else {
      message = `نتيجة امتحان الطالب ${student.name}: المادة ${record.subject}، الدرجة: ${record.score}/${record.total_score}، التاريخ: ${new Date(record.date).toLocaleDateString("ar-EG")}`
    }

    const whatsappUrl = `https://wa.me/${parentPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>بيانات الطالب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>الاسم:</strong> {student.name}
            </div>
            <div>
              <strong>رقم الطالب:</strong> {student.id}
            </div>
            <div>
              <strong>الرقم القومي:</strong> {student.national_id}
            </div>
            <div>
              <strong>رقم الهاتف:</strong> {student.phone}
            </div>
            <div>
              <strong>نظام التعليم:</strong> {student.education_sys === "3am" ? "عام" : "أزهر"}
            </div>
            <div>
              <strong>السنة الدراسية:</strong> {getAcademicYearLabel(student.academic_year)}
            </div>
            <div>
              <strong>المركز:</strong> {student.center_name}
            </div>
            <div>
              <strong>المجموعة:</strong> {student.group_name}
            </div>
            <div>
              <strong>ملاحظات:</strong> {student.notes || "لا توجد ملاحظات"}
            </div>
          </div>
          <div className="mt-4">
            <strong>الباركود:</strong>
            <div className="mt-2">
              <Image
                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${student.id}&scale=3&includetext&textxalign=center`}
                alt={`Barcode for student ${student.id}`}
                width={200}
                height={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>أولياء الأمور</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>صلة القرابة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.parents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>{parent.name}</TableCell>
                  <TableCell>{parent.phone}</TableCell>
                  <TableCell>{parent.relation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>السجلات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "attendance" | "exams")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attendance">سجل الحضور</TabsTrigger>
              <TabsTrigger value="exams">سجل الامتحانات</TabsTrigger>
            </TabsList>
            <TabsContent value="attendance">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>وقت الوصول</TableHead>
                    <TableHead>سبب الغياب</TableHead>
                    <TableHead>إرسال رسالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance?.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString("ar-EG")}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.arrival_time || "-"}</TableCell>
                      <TableCell>{record.excuse_reason || "-"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => sendWhatsAppMessage(record, "attendance")}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="exams">
              {isLoadingExams ? (
                <LoadingSpinner />
              ) : examsError ? (
                <Alert>
                  <AlertDescription>بيانات الامتحانات غير متوفرة حالياً. سيتم إضافة هذه الميزة قريباً.</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المادة</TableHead>
                      <TableHead>الدرجة</TableHead>
                      <TableHead>الدرجة الكلية</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>إرسال رسالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>{record.score}</TableCell>
                        <TableCell>{record.total_score}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString("ar-EG")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => sendWhatsAppMessage(record, "exam")}>
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

