import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import type { Group, Center } from "@/app/types"
import { useGetCentersQuery } from "@/app/redux/features/centersApi"
import { useToast } from "@/components/ui/use-toast"
import { academicYears } from "@/app/constants/academicYears"

// Removed local definition of academicYears

interface GroupDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (group: Partial<Group>) => void
  group?: Group | null
  centerId?: string | null
  academicYear?: string | null
}

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

export function GroupDialog({ isOpen, onClose, onSubmit, group, centerId, academicYear }: GroupDialogProps) {
  const [name, setName] = useState("")
  const [centerIdState, setCenterId] = useState("")
  const [days, setDays] = useState<string[]>([])
  const [times, setTimes] = useState("")
  const [academicYearState, setAcademicYear] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    centerId?: string
    days?: string
    times?: string
    academicYear?: string
  }>({})

  const { data: centers } = useGetCentersQuery()
  const { toast } = useToast()

  useEffect(() => {
    if (group) {
      setName(group.name)
      setDays(group.days)
      setTimes(group.times)
      setNotes(group.notes || "")
    } else {
      setName("")
      setDays([])
      setTimes("")
      setNotes("")
    }
    // Use the provided centerId and academicYear if available
    setCenterId(group?.center_id?.toString() || centerId || "")
    setAcademicYear(group?.academic_year || academicYear || "")
  }, [group, centerId, academicYear])

  const validateForm = () => {
    const newErrors: {
      name?: string
      centerId?: string
      days?: string
      times?: string
      academicYear?: string
    } = {}

    if (!name.trim()) {
      newErrors.name = "اسم المجموعة مطلوب"
    } else if (name.length < 3) {
      newErrors.name = "يجب أن يكون اسم المجموعة 3 أحرف على الأقل"
    }

    if (!centerIdState) {
      newErrors.centerId = "المركز مطلوب"
    }

    if (days.length === 0) {
      newErrors.days = "يجب اختيار يوم واحد على الأقل"
    }

    if (!times.trim()) {
      newErrors.times = "أوقات الدوام مطلوبة"
    }

    if (!academicYearState) {
      newErrors.academicYear = "السنة الدراسية مطلوبة"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    if (!centerIdState) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المركز",
        variant: "destructive",
      })
      return
    }
    onSubmit({
      id: group?.id,
      name,
      center_id: Number(centerIdState),
      days,
      times,
      academic_year: academicYearState,
      notes,
    })
    onClose()
  }

  const toggleDay = (day: string) => {
    setDays((prev) => {
      const newDays = [...prev]
      const index = newDays.indexOf(day)
      if (index > -1) {
        newDays.splice(index, 1)
      } else {
        newDays.push(day)
      }
      return newDays
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{group ? "تعديل المجموعة" : "إضافة مجموعة جديدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المجموعة</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                dir="rtl"
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="center">المركز</Label>
                <Select value={centerIdState} onValueChange={setCenterId} required>
                  <SelectTrigger id="center">
                    <SelectValue placeholder="اختر المركز" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers?.map((center) => (
                      <SelectItem key={center.id} value={center.id.toString()}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.centerId && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.centerId}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div>
                <Label htmlFor="academicYear">السنة الدراسية</Label>
                <Select value={academicYearState} onValueChange={setAcademicYear} disabled={!!academicYear}>
                  <SelectTrigger id="academicYear">
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
                {errors.academicYear && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.academicYear}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>أيام الدوام</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox id={day} checked={days.includes(day)} onCheckedChange={() => toggleDay(day)} />
                    <label htmlFor={day} className="mr-2 text-sm">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
              {errors.days && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.days}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="times">أوقات الدوام</Label>
              <Input
                id="times"
                value={times}
                onChange={(e) => setTimes(e.target.value)}
                placeholder="مثال: 4:00 م - 6:00 م"
                className={errors.times ? "border-red-500" : ""}
                dir="rtl"
              />
              {errors.times && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.times}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي ملاحظات هنا..."
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{group ? "تعديل المجموعة" : "إضافة المجموعة"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

