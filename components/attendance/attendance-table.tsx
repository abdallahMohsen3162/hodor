import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AttendanceRecord {
  id: number
  studentId: number
  student_name: string
  status: string
  arrival_time: string | null
  excuse_reason: string | null
}

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[]
  isSessionActive: boolean
  onMarkAttendance: (record: any, action:string, excuse_reason: string) => void
}

export function AttendanceTable({ attendanceData, isSessionActive, onMarkAttendance }: AttendanceTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge>حاضر</Badge>
      case "absent":
        return <Badge variant="destructive">غائب</Badge>
      case "excused":
        return <Badge variant="outline">معذور</Badge>
      case "pending":
        return <Badge variant="secondary">قيد الانتظار</Badge>
      case "late":
        return <Badge variant="warning">متأخر</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }
  console.log("attendanceData", attendanceData);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>رقم الطالب</TableHead>
          <TableHead>اسم الطالب</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>وقت الوصول</TableHead>
          <TableHead>سبب الغياب</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceData.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.studentId}</TableCell>
            <TableCell>{record.student_name}</TableCell>
            <TableCell>{getStatusBadge(record.status)}</TableCell>
            <TableCell>{record.arrival_time || "-"}</TableCell>
            <TableCell>{record.excuse_reason || "-"}</TableCell>
            <TableCell>
              {isSessionActive && (record.status === "pending" || record.status === "absent") && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      onMarkAttendance(record, "mark_attended", '')
                      
                    }}
                  >
                    تسجيل حضور
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const excuseReason = prompt("أدخل سبب الغياب:")
                      console.log("excuseReason", excuseReason);
                      
                      if (excuseReason) {
                        onMarkAttendance(record, "mark_excused", excuseReason)
                      }
                    }}
                  >
                    تسجيل غياب بعذر
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

