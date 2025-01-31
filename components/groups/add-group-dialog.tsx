import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface GroupDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (group: {
    id?: string
    name: string
    days: string[]
    times: string
    academicYear: string
    notes: string
    center_id: number
  }) => void
  centerId: string | null
  academicYear: string | null
  groupToEdit?: {
    id: string
    name: string
    days: string[]
    times: string
    notes?: string
  } | null
}

const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

export function GroupDialog({ isOpen, onClose, onSubmit, centerId, academicYear, groupToEdit }: GroupDialogProps) {
  const [name, setName] = useState("")
  const [days, setDays] = useState<{ day: string; schedule: string }[]>([])
  const [times, setTimes] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (groupToEdit) {
      setName(groupToEdit.name)
      setDays(groupToEdit.days.map((day) => ({ day, schedule: "" })))
      setTimes(groupToEdit.times)
      setNotes(groupToEdit.notes || "")
    } else {
      setName("")
      setDays([])
      setTimes("")
      setNotes("")
    }
  }, [groupToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!centerId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار السنتر أولاً",
        variant: "destructive",
      })
      return
    }
    onSubmit({
      id: groupToEdit?.id,
      name,
      center_id: Number.parseInt(centerId),
      days: days.map((d) => d.day),
      times,
      academicYear: academicYear || "",
      notes,
    })
    onClose()
  }

  const toggleDay = (day: string) => {
    setDays((prevDays) => {
      const dayIndex = prevDays.findIndex((d) => d.day === day)
      if (dayIndex > -1) {
        return prevDays.filter((d) => d.day !== day)
      } else {
        return [...prevDays, { day, schedule: "" }]
      }
    })
  }

  const updateDaySchedule = (day: string, schedule: string) => {
    setDays((prevDays) => {
      const updatedDays = prevDays.map((d) => {
        if (d.day === day) {
          return { ...d, schedule }
        }
        return d
      })
      return updatedDays
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{groupToEdit ? "تعديل المجموعة" : "إضافة مجموعة جديدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم المجموعة
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">أيام الدوام</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={days.some((d) => d.day === day) ? "default" : "outline"}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            {days.map((day) => (
              <div key={day.day} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`schedule-${day.day}`} className="text-right">
                  جدول {day.day}
                </Label>
                <Input
                  id={`schedule-${day.day}`}
                  value={day.schedule}
                  onChange={(e) => updateDaySchedule(day.day, e.target.value)}
                  className="col-span-3"
                  placeholder="مثال: 4:00 م - 6:00 م"
                />
              </div>
            ))}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="times" className="text-right">
                أوقات الدوام العامة
              </Label>
              <Input
                id="times"
                value={times}
                onChange={(e) => setTimes(e.target.value)}
                className="col-span-3"
                placeholder="مثال: 4:00 م - 6:00 م (اختياري)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                ملاحظات
              </Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                placeholder="أي ملاحظات إضافية"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{groupToEdit ? "تعديل المجموعة" : "إضافة المجموعة"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

