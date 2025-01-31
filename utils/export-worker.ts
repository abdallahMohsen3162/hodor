import type { Student } from "@/app/types"
import * as XLSX from "xlsx"

self.onmessage = (event: MessageEvent) => {
  const { students } = event.data as { students: Student[] }

  try {
    if (!Array.isArray(students)) {
      throw new Error("Invalid students data: not an array")
    }

    if (students.length === 0) {
      throw new Error("Empty students array")
    }

    const headers = [
      "الاسم",
      "الرقم القومي",
      "رقم الهاتف",
      "السنة الدراسية",
      "المركز",
      "المجموعة",
      "أولياء الأمور",
      "ملاحظات",
    ]

    const data = [
      headers,
      ...students.map((student) => [
        student.name,
        student.national_id,
        student.phone,
        student.academic_year,
        student.center_name,
        student.group_name,
        student.parents.map((p) => `${p.name} (${p.relation}): ${p.phone}`).join("; "),
        student.notes,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Students")

    const xlsxData = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    if (!xlsxData || xlsxData.length === 0) {
      throw new Error("Generated XLSX data is empty")
    }

    self.postMessage({ xlsxData })
  } catch (error) {
    console.error("Error in export worker:", error)
    self.postMessage({ error: error instanceof Error ? error.message : "Unknown error occurred during XLSX export" })
  }
}

