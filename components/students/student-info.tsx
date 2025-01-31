const academicYears = [
  { value: "1", label: "الصف الأول الابتدائي" },
  { value: "2", label: "الصف الثاني الابتدائي" },
  { value: "3", label: "الصف الثالث الابتدائي" },
  { value: "4", label: "الصف الرابع الابتدائي" },
  { value: "5", label: "الصف الخامس الابتدائي" },
  { value: "6", label: "الصف السادس الابتدائي" },
  { value: "7", label: "الصف الأول الإعدادي" },
  { value: "8", label: "الصف الثاني الإعدادي" },
  { value: "9", label: "الصف الثالث الإعدادي" },
  { value: "10", label: "الصف الأول الثانوي" },
  { value: "11", label: "الصف الثاني الثانوي" },
  { value: "12", label: "الصف الثالث الثانوي" },
]

const getAcademicYearLabel = (value: string) => {
  const year = academicYears.find((y) => y.value === value)
  return year ? year.label : value
}

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Student } from "@/app/types"

interface StudentInfoProps {
  student: Student
}

export function StudentInfo({ student }: StudentInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">الرقم القومي:</p>
            <p>{student.national_id}</p>
          </div>
          <div>
            <p className="font-semibold">رقم الهاتف:</p>
            <p>{student.phone}</p>
          </div>
          <div>
            <p className="font-semibold">السنة الدراسية:</p>
            <p>{getAcademicYearLabel(student.academic_year)}</p>
          </div>
          <div>
            <p className="font-semibold">المركز:</p>
            <p>{student.center_name}</p>
          </div>
          <div>
            <p className="font-semibold">المجموعة:</p>
            <p>{student.group_name}</p>
          </div>
          <div>
            <p className="font-semibold">ملاحظات:</p>
            <p>{student.notes || "لا توجد ملاحظات"}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">أولياء الأمور</h3>
          {student.parents.map((parent, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p>
                <span className="font-semibold">اسم ولي الأمر:</span> {parent.name}
              </p>
              <p>
                <span className="font-semibold">رقم هاتف ولي الأمر:</span> {parent.phone}
              </p>
              <p>
                <span className="font-semibold">صلة القرابة:</span> {parent.relation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

