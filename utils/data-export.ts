import type { Student } from "@/app/types"
import * as XLSX from "xlsx"
import JsBarcode from "jsbarcode"
import { jsPDF } from "jspdf"

const logError = (message: string, error: unknown) => {
  console.error(message, error)
  if (error instanceof Error) {
    return `${message}: ${error.message}`
  }
  return `${message}: Unknown error occurred`
}

// Function to export filtered students data to XLSX
export const exportStudentsToXLSX = (students: Student[]): void => {
  try {
    if (!students || students.length === 0) {
      throw new Error("No students data to export")
    }

    const worksheet = XLSX.utils.json_to_sheet(
      students.map((student) => ({
        الاسم: student.name,
        "الرقم القومي": student.national_id,
        "رقم الهاتف": student.phone,
        "السنة الدراسية": student.academic_year,
        المركز: student.center_name,
        المجموعة: student.group_name,
        ملاحظات: student.notes,
      })),
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

    XLSX.writeFile(workbook, `students_export_${new Date().toISOString()}.xlsx`)
  } catch (error) {
    const errorMessage = logError("Export error", error)
    throw new Error(errorMessage)
  }
}

// Function to export barcode sheet
export const exportBarcodeSheet = (students: Student[]): void => {
  try {
    if (!students || students.length === 0) {
      throw new Error("No students data to export")
    }

    const pdf = new jsPDF()
    let yPosition = 10

    students.forEach((student, index) => {
      if (index > 0 && index % 3 === 0) {
        pdf.addPage()
        yPosition = 10
      }

      // Add student name and ID
      pdf.setFontSize(12)
      pdf.text(`${student.name} - ID: ${student.id}`, 10, yPosition)

      // Generate barcode as SVG
      const canvas = document.createElement("canvas")
      JsBarcode(canvas, student.id.toString(), {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: false,
      })

      // Add barcode to PDF
      pdf.addImage(canvas.toDataURL(), "PNG", 10, yPosition + 5, 80, 20)

      yPosition += 40
    })

    pdf.save(`barcode_sheet_${new Date().toISOString()}.pdf`)
  } catch (error) {
    const errorMessage = logError("Barcode export error", error)
    throw new Error(errorMessage)
  }
}

// Function to import students from XLSX
export const importStudentsFromXLSX = async (file: File): Promise<Partial<Student>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Partial<Student>[]
        resolve(jsonData)
      } catch (error) {
        const errorMessage = logError("Import error", error)
        reject(new Error(errorMessage))
      }
    }
    reader.onerror = (error) => {
      const errorMessage = logError("File reading error", error)
      reject(new Error(errorMessage))
    }
    reader.readAsArrayBuffer(file)
  })
}

