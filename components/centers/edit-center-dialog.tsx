import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Center } from "@/app/types"

interface EditCenterDialogProps {
  isOpen: boolean
  onClose: () => void
  onEditCenter: (center: Center) => void
  center: Center | null
}

export function EditCenterDialog({ isOpen, onClose, onEditCenter, center }: EditCenterDialogProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (center) {
      setName(center.name)
      setLocation(center.location)
    }
  }, [center])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (center) {
      onEditCenter({ ...center, name, location })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل المركز</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم المركز
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                الموقع
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">تعديل المركز</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

