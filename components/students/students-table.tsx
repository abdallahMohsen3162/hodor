import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import type { Student } from "@/app/types"
import { getAcademicYearLabel } from "@/utils/academicYearUtils"
import Link from "next/link"

interface StudentsTableProps {
  students: Student[]
  onEditStudent: (student: Student) => void
  onDeleteStudent: (studentId: number) => void
}

export function StudentsTable({ students, onEditStudent, onDeleteStudent }: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">الاسم</TableHead>
            <TableHead className="font-semibold">رقم الطالب</TableHead>
            <TableHead className="font-semibold">رقم الهاتف</TableHead>
            <TableHead className="font-semibold">نظام التعليم</TableHead>
            <TableHead className="font-semibold">السنة الدراسية</TableHead>
            <TableHead className="font-semibold">المركز</TableHead>
            <TableHead className="font-semibold">المجموعة</TableHead>
            <TableHead className="font-semibold">الحالة</TableHead>
            <TableHead className="font-semibold">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id} className="hover:bg-muted/50 transition-colors duration-200">
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.id}</TableCell>
              <TableCell>{student.phone}</TableCell>
              <TableCell>{student.education_sys === "3am" ? "عام" : "أزهر"}</TableCell>
              <TableCell>{getAcademicYearLabel(student.academic_year)}</TableCell>
              <TableCell>{student.center_name}</TableCell>
              <TableCell>{student.group_name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(student.status)}`}>
                  {getStatusText(student.status)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/students/${student.id}`}>
                    <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Eye className="w-4 h-4 mr-1" />
                      التفاصيل
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStudent(student)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function getStatusClass(status: string): string {
  switch (status) {
    case "present":
      return "status-present"
    case "absent":
      return "status-absent"
    case "late":
      return "status-late"
    case "excused":
      return "status-excused"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "present":
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

