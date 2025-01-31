import { StudentDetails } from "@/components/students/student-details"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "تفاصيل الطالب | حضور",
  description: "عرض تفاصيل الطالب وسجل الحضور",
}

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">تفاصيل الطالب</h1>
      <StudentDetails studentId={params.id} />
    </div>
  )
}

