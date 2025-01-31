import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Center } from "@/app/types"

interface CenterDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (center: Partial<Center>) => void
  center?: Center | null
}

export function CenterDialog({ isOpen, onClose, onSubmit, center }: CenterDialogProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({})

  useEffect(() => {
    if (center) {
      setName(center.name)
      setLocation(center.location)
    } else {
      setName("")
      setLocation("")
    }
    setErrors({})
  }, [center])

  const validateForm = () => {
    const newErrors: { name?: string; location?: string } = {}

    if (!name.trim()) {
      newErrors.name = "اسم المركز مطلوب"
    } else if (name.length < 3) {
      newErrors.name = "يجب أن يكون اسم المركز 3 أحرف على الأقل"
    }

    if (!location.trim()) {
      newErrors.location = "موقع المركز مطلوب"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const updatedCenter: Partial<Center> = {
      id: center?.id,
      name: name.trim(),
      location: location.trim(),
    }

    onSubmit(updatedCenter)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{center ? "تعديل المركز" : "إضافة مركز جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المركز</Label>
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
          <div className="space-y-2">
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={errors.location ? "border-red-500" : ""}
              dir="rtl"
            />
            {errors.location && (
              <Alert variant="destructive">
                <AlertDescription>{errors.location}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">{center ? "تعديل" : "إضافة"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

