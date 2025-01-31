"use client"

import { useState } from "react"
import { CentersTable } from "@/components/centers-table"
import { CenterDialog } from "@/components/centers/center-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  useGetCentersQuery,
  useAddCenterMutation,
  useDeleteCenterMutation,
  useUpdateCenterMutation,
} from "@/app/api/centersApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Center } from "@/app/types"

export function CentersManagement() {
  const [isCenterDialogOpen, setIsCenterDialogOpen] = useState(false)
  const [centerToEdit, setCenterToEdit] = useState<Center | null>(null)
  const { toast } = useToast()

  const { data: centers, isLoading, error } = useGetCentersQuery()
  const [addCenter] = useAddCenterMutation()
  const [deleteCenter] = useDeleteCenterMutation()
  const [updateCenter] = useUpdateCenterMutation()

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>حدث خطأ أثناء تحميل بيانات المراكز. يرجى المحاولة مرة أخرى.</AlertDescription>
      </Alert>
    )
  }

  const handleAddCenter = async (newCenter: { name: string; location: string }) => {
    try {
      await addCenter(newCenter).unwrap()
      setIsCenterDialogOpen(false)
      toast({
        title: "تمت إضافة المركز",
        description: "تمت إضافة المركز بنجاح",
      })
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المركز",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCenter = async (centerId: string) => {
    try {
      await deleteCenter(Number(centerId)).unwrap()
      toast({
        title: "تم حذف المركز",
        description: "تم حذف المركز بنجاح",
      })
    } catch (err: any) {
      if (err.status === 400 && err.data?.message === "Cannot delete center with existing groups") {
        toast({
          title: "لا يمكن حذف المركز",
          description: "لا يمكن حذف المركز لأنه يحتوي على مجموعات. قم بحذف المجموعات أولاً.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف المركز",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditCenter = async (updatedCenter: Center) => {
    try {
      await updateCenter(updatedCenter).unwrap()
      setCenterToEdit(null)
      toast({
        title: "تم تعديل المركز",
        description: "تم تعديل المركز بنجاح",
      })
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل المركز",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">إدارة السناتر</CardTitle>
        <CardDescription>قم بإضافة وتعديل وحذف السناتر</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button onClick={() => setIsCenterDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" /> إضافة مركز جديد
          </Button>
        </div>
        <CentersTable
          centers={centers || []}
          onDeleteCenter={handleDeleteCenter}
          onEditCenter={(center) => setCenterToEdit(center)}
        />
        <CenterDialog
          isOpen={isCenterDialogOpen || !!centerToEdit}
          onClose={() => {
            setIsCenterDialogOpen(false)
            setCenterToEdit(null)
          }}
          onSubmit={(center) => {
            if (centerToEdit) {
              handleEditCenter({ ...centerToEdit, ...center })
            } else {
              handleAddCenter(center)
            }
          }}
          center={centerToEdit}
        />
      </CardContent>
    </Card>
  )
}

