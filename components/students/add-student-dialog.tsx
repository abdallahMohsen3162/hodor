"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Student, Center, Group, Parent } from "@/app/types"
import { useGetCentersQuery, useGetGroupsQuery } from "@/app/redux/features/studentsApi"
import { academicYears } from "@/app/constants/academicYears"

interface AddStudentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddStudent: (student: Omit<Student, "id">) => void
}

export function AddStudentDialog({ isOpen, onClose, onAddStudent }: AddStudentDialogProps) {
  const [name, setName] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [phone, setPhone] = useState("")
  const [educationSys, setEducationSys] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [centerId, setCenterId] = useState("")
  const [groupId, setGroupId] = useState("")
  const [notes, setNotes] = useState("")
  const [parents, setParents] = useState<Omit<Parent, "id">[]>([{ name: "", phone: "", relation: "" }])

  const { data: centers } = useGetCentersQuery()
  const { data: groups } = useGetGroupsQuery()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newStudent: Omit<Student, "id"> = {
      name,
      national_id: nationalId,
      phone,
      education_sys: educationSys,
      academic_year: academicYear,
      center_id: Number(centerId),
      group_id: Number(groupId),
      notes,
      parents,
    }

    onAddStudent(newStudent)
    onClose()
  }

  const handleParentChange = (index: number, field: keyof Parent, value: string) => {
    const updatedParents = [...parents]
    updatedParents[index] = { ...updatedParents[index], [field]: value }
    setParents(updatedParents)
  }

  const addParent = () => {
    setParents([...parents, { name: "", phone: "", relation: "" }])
  }

  const removeParent = (index: number) => {
    const updatedParents = parents.filter((_, i) => i !== index)
    setParents(updatedParents)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة طالب جديد</DialogTitle>
          <DialogDescription>أدخل تفاصيل الطالب الجديد هنا. انقر على حفظ عند الانتهاء.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم الطالب</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="nationalId">الرقم القومي للطالب</Label>
              <Input id="nationalId" value={nationalId} onChange={(e) => setNationalId(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="phone">رقم هاتف الطالب</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="educationSys">نظام التعليم</Label>
              <Select value={educationSys} onValueChange={setEducationSys} required>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نظام التعليم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3am">عام</SelectItem>
                  <SelectItem value="azhar">أزهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="academicYear">السنة الدراسية</Label>
              <Select value={academicYear} onValueChange={setAcademicYear} required>
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
            </div>
            <div>
              <Label htmlFor="center">المركز</Label>
              <Select value={centerId} onValueChange={setCenterId} required>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المركز" />
                </SelectTrigger>
                <SelectContent>
                  {centers?.map((center: Center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="group">المجموعة</Label>
              <Select value={groupId} onValueChange={setGroupId} required>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المجموعة" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((group: Group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {/* Parents section */}
            <div className="space-y-4">
              <Label>أولياء الأمور</Label>
              {parents.map((parent, index) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <div>
                    <Label htmlFor={`parentName${index}`}>اسم ولي الأمر</Label>
                    <Input
                      id={`parentName${index}`}
                      value={parent.name}
                      onChange={(e) => handleParentChange(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`parentPhone${index}`}>رقم هاتف ولي الأمر</Label>
                    <Input
                      id={`parentPhone${index}`}
                      value={parent.phone}
                      onChange={(e) => handleParentChange(index, "phone", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`parentRelation${index}`}>صلة القرابة</Label>
                    <Input
                      id={`parentRelation${index}`}
                      value={parent.relation}
                      onChange={(e) => handleParentChange(index, "relation", e.target.value)}
                      required
                    />
                  </div>
                  {parents.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => removeParent(index)}>
                      حذف ولي الأمر
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addParent}>
                إضافة ولي أمر
              </Button>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">حفظ الطالب</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

