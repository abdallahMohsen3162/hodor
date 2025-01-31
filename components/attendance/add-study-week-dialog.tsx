import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddStudyWeekMutation } from "@/app/redux/features/studyWeeksApi"
import { useToast } from "@/components/ui/use-toast"

interface AddStudyWeekDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddWeek: (weekData: { name: string; start_date: string; end_date: string }) => Promise<void>
}

export function AddStudyWeekDialog({ isOpen, onClose, onAddWeek }: AddStudyWeekDialogProps) {
  const [name, setName] = useState("")
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split("T")[0])
  const [addStudyWeek, { isLoading }] = useAddStudyWeekMutation()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addStudyWeek({ name, start_date: startDate, end_date: endDate }).then((result) => {console.log(result)})
      // await onAddWeek({ name, start_date: startDate, end_date: endDate })
      toast({
        title: "تم إضافة الأسبوع",
        description: "تم إضافة الأسبوع الدراسي بنجاح",
      })
      onClose()
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الأسبوع الدراسي",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة أسبوع دراسي جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم الأسبوع
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                تاريخ البداية
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                تاريخ النهاية
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "جاري الإضافة..." : "إضافة الأسبوع"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

