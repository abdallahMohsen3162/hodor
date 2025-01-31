"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  useGetCentersQuery,
  useAddCenterMutation,
  useUpdateCenterMutation,
  useDeleteCenterMutation,
} from "@/app/api/centersApi"
import {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from "@/app/api/groupsApi"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CenterDialog } from "@/components/centers/center-dialog"
import { GroupDialog } from "@/components/groups/group-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Center, Group } from "@/app/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConnectionError } from "@/components/ui/connection-error"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { academicYears } from "@/app/constants/academicYears"

export default function CentersAndGroupsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null)
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string | null>(null)
  const [isCenterDialogOpen, setIsCenterDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [editingCenter, setEditingCenter] = useState<Center | null>(null)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingCenter, setDeletingCenter] = useState<Center | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)

  const { toast } = useToast()

  const {
    data: centers,
    isLoading: isLoadingCenters,
    error: centersError,
    refetch: refetchCenters,
  } = useGetCentersQuery()
  const {
    data: groups,
    isLoading: isLoadingGroups,
    error: groupsError,
    refetch: refetchGroups,
  } = useGetGroupsQuery(
    { centerId: selectedCenter || undefined, academicYear: selectedAcademicYear || undefined },
    { skip: !selectedCenter || !selectedAcademicYear },
  )

  const [addCenter] = useAddCenterMutation()
  const [updateCenter] = useUpdateCenterMutation()
  const [deleteCenter] = useDeleteCenterMutation()
  const [addGroup] = useAddGroupMutation()
  const [updateGroup] = useUpdateGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()

  const isLoading = isLoadingCenters || isLoadingGroups

  useEffect(() => {
    if (selectedCenter && selectedAcademicYear) {
      refetchGroups()
    }
  }, [selectedCenter, selectedAcademicYear, refetchGroups])

  const handleError = (error: any) => {
    console.error("Operation failed:", error)
    toast({
      title: "خطأ",
      description: error?.data?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    })
  }

  const handleAddCenter = async (center: Partial<Center>) => {
    try {
      await addCenter(center).unwrap()
      setIsCenterDialogOpen(false)
      toast({
        title: "تم بنجاح",
        description: "تمت إضافة المركز بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  const handleUpdateCenter = async (center: Partial<Center>) => {
    try {
      await updateCenter(center).unwrap()
      setIsCenterDialogOpen(false)
      setEditingCenter(null)
      toast({
        title: "تم بنجاح",
        description: "تم تحديث المركز بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  const handleDeleteCenter = async (centerId: number) => {
    try {
      await deleteCenter(centerId).unwrap()
      toast({
        title: "تم بنجاح",
        description: "تم حذف المركز بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddGroup = async (group: Partial<Group>) => {
    try {
      await addGroup(group).unwrap()
      setIsGroupDialogOpen(false)
      toast({
        title: "تم بنجاح",
        description: "تمت إضافة المجموعة بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  const handleUpdateGroup = async (group: Partial<Group>) => {
    try {
      await updateGroup(group).unwrap()
      setIsGroupDialogOpen(false)
      setEditingGroup(null)
      await refetchGroups()
      toast({
        title: "تم بنجاح",
        description: "تم تحديث المجموعة بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId).unwrap()
      toast({
        title: "تم بنجاح",
        description: "تم حذف المجموعة بنجاح",
      })
    } catch (error) {
      handleError(error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (centersError || groupsError) {
    return (
      <ConnectionError
        message="حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى."
        onRetry={() => {
          refetchCenters()
          refetchGroups()
        }}
      />
    )
  }

  const filteredCenters = centers?.filter((center) => center.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredGroups = groups?.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المراكز والمجموعات</h1>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن مركز أو مجموعة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsGroupDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مجموعة
          </Button>
          <Button onClick={() => setIsCenterDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة مركز
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Centers Section - 4 columns */}
        <div className="col-span-4">
          <div className="space-y-4">
            {filteredCenters?.map((center) => (
              <Card
                key={center.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedCenter === center.id.toString() ? "border-primary" : ""
                }`}
                onClick={() => setSelectedCenter(center.id.toString())}
              >
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{center.name}</h3>
                    <p className="text-sm text-muted-foreground">{center.location}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">عدد المجموعات: {center.groups?.length || 0}</div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingCenter(center)
                            setIsCenterDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeletingCenter(center)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Groups Section - 8 columns */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>المجموعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Select value={selectedAcademicYear || ""} onValueChange={setSelectedAcademicYear}>
                      <SelectTrigger>
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
                <div className="grid grid-cols-6 gap-4 font-medium text-muted-foreground">
                  <div>اسم المجموعة</div>
                  <div>أيام الجدول</div>
                  <div>الأوقات</div>
                  <div>المركز</div>
                  <div>السنة الدراسية</div>
                  <div>الإجراءات</div>
                </div>
                {filteredGroups?.map((group) => (
                  <div key={group.id} className="grid grid-cols-6 gap-4 py-3 border-b">
                    <div>{group.name}</div>
                    <div>{group.days.join(", ")}</div>
                    <div>{group.times}</div>
                    <div>{centers?.find((c) => c.id === group.center_id)?.name}</div>
                    <div>
                      {academicYears.find((year) => year.value === group.academic_year)?.label || group.academic_year}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingGroup(group)
                          setIsGroupDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeletingGroup(group)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CenterDialog
        isOpen={isCenterDialogOpen}
        onClose={() => {
          setIsCenterDialogOpen(false)
          setEditingCenter(null)
        }}
        onSubmit={(center) => {
          if (editingCenter) {
            handleUpdateCenter({ ...editingCenter, ...center })
          } else {
            handleAddCenter(center)
          }
        }}
        center={editingCenter}
      />

      <GroupDialog
        isOpen={isGroupDialogOpen}
        onClose={() => {
          setIsGroupDialogOpen(false)
          setEditingGroup(null)
        }}
        onSubmit={(group) => {
          if (editingGroup) {
            handleUpdateGroup({ ...editingGroup, ...group })
          } else {
            handleAddGroup(group)
          }
        }}
        group={editingGroup}
        centerId={selectedCenter}
        academicYear={selectedAcademicYear}
      />

      <AlertDialog open={!!deletingCenter} onOpenChange={() => setDeletingCenter(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المركز</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذا المركز؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCenter) {
                  handleDeleteCenter(deletingCenter.id)
                }
              }}
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingGroup} onOpenChange={() => setDeletingGroup(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف المجموعة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذه المجموعة؟ سيتم حذف جميع الطلاب المرتبطين بها أيضًا. لا يمكن التراجع عن هذا
              الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingGroup) {
                  handleDeleteGroup(deletingGroup.id)
                }
              }}
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

