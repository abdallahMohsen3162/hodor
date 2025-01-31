import React, { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useGetGroupsQuery } from "@/app/redux/features/groupsApi"
import { useGetCentersQuery } from "@/app/redux/features/centersApi"
import { useGetStudyWeeksQuery, useAddStudyWeekMutation } from "@/app/redux/features/studyWeeksApi"
import { useGetStudentsQuery } from "@/app/redux/features/studentsApi"
import { academicYears } from "@/app/constants/academicYears"
import { AddStudyWeekDialog } from "./add-study-week-dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AttendanceFiltersProps {
  groupId: string | undefined
  setGroupId: (groupId: string) => void
  weekId: string | undefined
  setWeekId: (weekId: string) => void
  date: string
  setDate: (date: string) => void
  maxLateTime: string
  setMaxLateTime: (time: string) => void
  academicYear: string | undefined
  setAcademicYear: (year: string) => void
  centerId: string | undefined
  setCenterId: (centerId: string) => void
}

export function AttendanceFilters({
  groupId,
  setGroupId,
  weekId,
  setWeekId,
  academicYear,
  setAcademicYear,
  centerId,
  setCenterId,
  maxLateTime,
  setMaxLateTime,
  date,
  setDate,
}: AttendanceFiltersProps) {
  const [isAddWeekDialogOpen, setIsAddWeekDialogOpen] = useState(false)
  const { data: groups = [], refetch: refetchGroups } = useGetGroupsQuery()
  const { data: centers = [] } = useGetCentersQuery()
  const { data: weeks = [], refetch: refetchWeeks } = useGetStudyWeeksQuery()
  const { data: students = [] } = useGetStudentsQuery()
  const [addStudyWeek] = useAddStudyWeekMutation()
  const { toast } = useToast()

  useEffect(() => {
    if (centerId && academicYear) {
      refetchGroups()
    }
  }, [centerId, academicYear, refetchGroups])

  const filteredGroups = groups.filter(
    (group) =>
      (!centerId || group.center_id.toString() === centerId) && (!academicYear || group.academic_year === academicYear),
  )

  const filteredStudents = students.filter(
    (student) =>
      (!academicYear || student.academic_year === academicYear) &&
      (!centerId || student.center_id.toString() === centerId) &&
      (!groupId || student.group_id.toString() === groupId),
  )

  const handleAddWeek = async (weekData: { name: string; start_date: string; end_date: string }) => {
    try {
      await addStudyWeek(weekData).unwrap()
      toast({
        title: "تم إضافة الأسبوع بنجاح",
        description: "تم إضافة الأسبوع الدراسي الجديد",
      })
      refetchWeeks()
    } catch (error) {
      toast({
        title: "خطأ في إضافة الأسبوع",
        description: "حدث خطأ أثناء إضافة الأسبوع الدراسي",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="academic-year-select">السنة الدراسية</Label>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger id="academic-year-select">
              <SelectValue placeholder="اختر السنة الدراسية" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="center-select">المركز</Label>
          <Select value={centerId} onValueChange={setCenterId}>
            <SelectTrigger id="center-select">
              <SelectValue placeholder="اختر المركز" />
            </SelectTrigger>
            <SelectContent>
              {centers.map((center) => (
                <SelectItem key={center.id} value={center.id.toString()}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="group-select">المجموعة</Label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger id="group-select">
              <SelectValue placeholder="اختر المجموعة" />
            </SelectTrigger>
            <SelectContent>
              {filteredGroups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="week-select">الأسبوع</Label>
          <div className="flex items-center space-x-2">
            <Select value={weekId} onValueChange={setWeekId}>
              <SelectTrigger id="week-select">
                <SelectValue placeholder="اختر الأسبوع" />
              </SelectTrigger>
              <SelectContent>
                {weeks.map((week) => (
                  <SelectItem key={week.id} value={week.id.toString()}>
                    {week.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAddWeekDialogOpen(true)}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="date-select">التاريخ</Label>
          <Input
            type="date"
            id="date-select"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="max-late-time">الحد الأقصى للتأخير (بالدقائق)</Label>
          <Input
            id="max-late-time"
            type="number"
            min="0"
            value={maxLateTime}
            onChange={(e) => setMaxLateTime(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <AddStudyWeekDialog
        isOpen={isAddWeekDialogOpen}
        onClose={() => setIsAddWeekDialogOpen(false)}
        onAddWeek={handleAddWeek}
      />
    </div>
  )
}

