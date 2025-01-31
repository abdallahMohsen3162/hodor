import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ManualEntryPanelProps {
  isSessionActive: boolean
  onMarkAttendance: (studentId: string) => void
}

export function ManualEntryPanel({ isSessionActive, onMarkAttendance }: ManualEntryPanelProps) {
  const [studentId, setStudentId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onMarkAttendance(studentId)
    setStudentId("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدخال يدوي</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="أدخل رقم الطالب"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" disabled={!studentId}>
            تسجيل حضور
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

