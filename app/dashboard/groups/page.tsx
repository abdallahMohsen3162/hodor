"use client"

import { useState } from "react"
import { GroupsTable } from "@/components/groups-table"
import { AddGroupDialog } from "@/components/add-group-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useGetGroupsQuery, useAddGroupMutation, useDeleteGroupMutation } from "@/app/redux/features/groupsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function GroupsManagementPage() {
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false)
  const { data: groups, isLoading, error } = useGetGroupsQuery()
  const [addGroup] = useAddGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()
  const { toast } = useToast()

  const handleAddGroup = async (newGroup: { name: string; centerId: number; grade: string; schedule: string }) => {
    try {
      await addGroup(newGroup).unwrap()
      setIsAddGroupDialogOpen(false)
      toast({
        title: "تمت إضافة المجموعة",
        description: "تمت إضافة المجموعة بنجاح",
      })
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المجموعة",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId).unwrap()
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
  }

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات المجموعات. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المجموعات</h1>
        <Button onClick={() => setIsAddGroupDialogOpen(true)}>إضافة مجموعة جديدة</Button>
      </div>
      <GroupsTable groups={groups || []} onDeleteGroup={handleDeleteGroup} />
      <AddGroupDialog
        isOpen={isAddGroupDialogOpen}
        onClose={() => setIsAddGroupDialogOpen(false)}
        onAddGroup={handleAddGroup}
      />
    </div>
  )
}

