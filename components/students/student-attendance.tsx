import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AttendanceRecord, Student } from "@/app/types"
import { formatDate } from "@/lib/utils"

interface StudentAttendanceProps {
  attendance: AttendanceRecord[]
  student: Student
}

export function StudentAttendance({ attendance, student }: StudentAttendanceProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "attended":
        return "default"
      case "absent":
        return "destructive"
      case "late":
        return "warning"
      case "excused":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "attended":
        return "حاضر"
      case "absent":
        return "غائب"
      case "late":
        return "متأخر"
      case "excused":
        return "معذور"
      default:
        return status
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>التاريخ</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>وقت الحضور</TableHead>
          <TableHead>سبب الغياب</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendance.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{formatDate(record.date)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(record.status)}>{getStatusText(record.status)}</Badge>
            </TableCell>
            <TableCell>{record.arrival_time || "-"}</TableCell>
            <TableCell>{record.excuse_reason || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

