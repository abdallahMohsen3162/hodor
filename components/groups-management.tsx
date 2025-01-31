"use client"

import { useState, useCallback } from "react"
import { GroupsTable } from "@/components/groups-table"
import { GroupDialog } from "@/components/groups/group-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  useGetGroupsQuery,
  useAddGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from "@/app/api/groupsApi"
import { useGetCentersQuery } from "@/app/api/centersApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { academicYears } from "@/app/constants/academicYears"

export function GroupsManagement() {
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null)
  const [groupToEdit, setGroupToEdit] = useState<any | null>(null)
  const { toast } = useToast()

  const { data: centers, isLoading: isLoadingCenters } = useGetCentersQuery()
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useGetGroupsQuery(
    { centerId: selectedCenter, academicYear: selectedAcademicYear },
    {
      skip: !selectedCenter || !selectedAcademicYear,
    },
  )
  const [addGroup] = useAddGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()
  const [updateGroup] = useUpdateGroupMutation()

  const handleAddOrEditGroup = useCallback(
    async (groupData: {
      id?: string
      name: string
      center_id: number
      days: string[]
      times: string
      academic_year: string
      notes: string
    }) => {
      try {
        if (groupData.id) {
          await updateGroup({ id: Number(groupData.id), group: groupData }).unwrap()
          toast({
            title: "تم تعديل المجموعة",
            description: "تم تعديل المجموعة بنجاح",
          })
        } else {
          await addGroup(groupData).unwrap()
          toast({
            title: "تمت إضافة المجموعة",
            description: "تمت إضافة المجموعة بنجاح",
          })
        }
        setIsGroupDialogOpen(false)
        setGroupToEdit(null)
      } catch (err) {
        if (err instanceof Error) {
          toast({
            title: "خطأ",
            description: err.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "خطأ",
            description: groupData.id ? "حدث خطأ أثناء تعديل المجموعة" : "حدث خطأ أثناء إضافة المجموعة",
            variant: "destructive",
          })
        }
      }
    },
    [addGroup, updateGroup, toast],
  )

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      try {
        await deleteGroup(Number(groupId)).unwrap()
        toast({
          title: "تم حذف المجموعة",
          description: "تم حذف المجموعة بنجاح",
        })
      } catch (err: any) {
        if (err.status === 400 && err.data?.message === "Cannot delete group with existing students") {
          toast({
            title: "لا يمكن حذف المجموعة",
            description: "لا يمكن حذف المجموعة لأنها تحتوي على طلاب. قم بنقل الطلاب أو حذفهم أولاً.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء حذف المجموعة",
            variant: "destructive",
          })
        }
      }
    },
    [deleteGroup, toast],
  )

  const handleEditGroup = useCallback((group: any) => {
    setGroupToEdit(group)
    setIsGroupDialogOpen(true)
  }, [])

  if (isLoadingCenters || isLoadingGroups) return <LoadingSpinner />

  if (groupsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات المجموعات. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">إدارة المجموعات</CardTitle>
        <CardDescription>قم بإضافة وتعديل وحذف ونقل المجموعات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="space-y-2">
              <Label htmlFor="center-select">اختر السنتر</Label>
              <Select value={selectedCenter || ""} onValueChange={setSelectedCenter}>
                <SelectTrigger id="center-select" className="w-[180px]">
                  <SelectValue placeholder="اختر السنتر" />
                </SelectTrigger>
                <SelectContent>
                  {centers?.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic-year-select">السنة الدراسية</Label>
              <Select value={selectedAcademicYear || ""} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger id="academic-year-select" className="w-[180px]">
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
          </div>
          <Button onClick={() => setIsGroupDialogOpen(true)} disabled={!selectedCenter || !selectedAcademicYear}>
            <Plus className="ml-2 h-4 w-4" /> إضافة مجموعة جديدة
          </Button>
        </div>
        {selectedCenter && selectedAcademicYear && groups && (
          <GroupsTable
            groups={groups}
            centers={centers || []}
            onDeleteGroup={handleDeleteGroup}
            onEditGroup={handleEditGroup}
          />
        )}
        <GroupDialog
          isOpen={isGroupDialogOpen}
          onClose={() => {
            setIsGroupDialogOpen(false)
            setGroupToEdit(null)
          }}
          onSubmit={handleAddOrEditGroup}
          centerId={selectedCenter}
          academicYear={selectedAcademicYear}
          groupToEdit={groupToEdit}
        />
      </CardContent>
    </Card>
  )
}

