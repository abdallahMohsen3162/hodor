"use client"

import { StudentsManagement } from "@/components/students/students-management"

export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة الطلاب</h1>
      <StudentsManagement />
    </div>
  )
}

