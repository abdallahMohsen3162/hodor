"use client"

import { useState, useEffect } from "react"
import { StudentsHeader } from "./students-header"
import { StudentsFilters } from "./students-filters"
import { StudentsTable } from "./students-table"
import { AddStudentDialog } from "./add-student-dialog"
import { EditStudentDialog } from "./edit-student-dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "@/app/redux/features/studentsApi"
import type { Student } from "@/app/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ErrorBoundary } from "@/components/error-boundary"

export function StudentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [academicYearFilter, setAcademicYearFilter] = useState("all")
  const [centerFilter, setCenterFilter] = useState("all")
  const [groupFilter, setGroupFilter] = useState("all")
  const [educationSysFilter, setEducationSysFilter] = useState("all")
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false)
  const [isEditStudentDialogOpen, setIsEditStudentDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const { toast } = useToast()

  const { data: students, isLoading, error, refetch } = useGetStudentsQuery()
  const [createStudent] = useCreateStudentMutation()
  const [updateStudent] = useUpdateStudentMutation()
  const [deleteStudent] = useDeleteStudentMutation()

  useEffect(() => {
    if (students) {
      setSearchTerm("")
      setAcademicYearFilter("all")
      setCenterFilter("all")
      setGroupFilter("all")
      setEducationSysFilter("all")
    }
  }, [students])

  if (isLoading) return <LoadingSpinner />

  if (error) {
    console.error("Error fetching students:", error)
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات الطلاب. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  const filteredStudents = students?.filter((student) => {
    try {
      const matchesSearch =
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toString().includes(searchTerm) ||
        (student.national_id && student.national_id.includes(searchTerm)) ||
        student.phone.includes(searchTerm)
      const matchesAcademicYear = academicYearFilter === "all" || student.academic_year === academicYearFilter
      const matchesCenter =
        centerFilter === "all" || (student.center_id && student.center_id.toString() === centerFilter)
      const matchesGroup = groupFilter === "all" || (student.group_id && student.group_id.toString() === groupFilter)
      const matchesEducationSys = educationSysFilter === "all" || student.education_sys === educationSysFilter

      return matchesSearch && matchesAcademicYear && matchesCenter && matchesGroup && matchesEducationSys
    } catch (err) {
      console.error("Error filtering student:", err, JSON.stringify(student))
      return false
    }
  })

  const handleAddStudent = async (newStudent: Omit<Student, "id">) => {
    try {
      await createStudent(newStudent).unwrap()
      setIsAddStudentDialogOpen(false)
      toast({
        title: "تمت إضافة الطالب",
        description: "تمت إضافة الطالب بنجاح",
      })
      refetch()
    } catch (err) {
      console.error("Error adding student:", err)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الطالب",
        variant: "destructive",
      })
    }
  }

  const handleEditStudent = async (updatedStudent: { id: number; student: Partial<Student> }) => {
    try {
      await updateStudent(updatedStudent).unwrap()
      setIsEditStudentDialogOpen(false)
      toast({
        title: "تم تحديث بيانات الطالب",
        description: "تم تحديث بيانات الطالب بنجاح",
      })
      refetch()
    } catch (err) {
      console.error("Error updating student:", err)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات الطالب",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await deleteStudent(studentId).unwrap()
      toast({
        title: "تم حذف الطالب",
        description: "تم حذف الطالب بنجاح",
      })
      refetch()
    } catch (err) {
      console.error("Error deleting student:", err)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطالب",
        variant: "destructive",
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <StudentsHeader
          onAddStudent={() => setIsAddStudentDialogOpen(true)}
          onImport={() => {
            /* Import function */
          }}
          filteredStudents={filteredStudents || []}
        />
        <StudentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          academicYearFilter={academicYearFilter}
          setAcademicYearFilter={setAcademicYearFilter}
          centerFilter={centerFilter}
          setCenterFilter={setCenterFilter}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          educationSysFilter={educationSysFilter}
          setEducationSysFilter={setEducationSysFilter}
        />
        <StudentsTable
          students={filteredStudents || []}
          onEditStudent={(student) => {
            setSelectedStudent(student)
            setIsEditStudentDialogOpen(true)
          }}
          onDeleteStudent={handleDeleteStudent}
        />
        <AddStudentDialog
          isOpen={isAddStudentDialogOpen}
          onClose={() => setIsAddStudentDialogOpen(false)}
          onAddStudent={handleAddStudent}
        />
        {selectedStudent && (
          <EditStudentDialog
            isOpen={isEditStudentDialogOpen}
            onClose={() => setIsEditStudentDialogOpen(false)}
            onEditStudent={handleEditStudent}
            student={selectedStudent}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

