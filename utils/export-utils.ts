import ExcelJS from 'exceljs'
import type { Student } from "@/app/types"

export async function exportBarcodeSheet(students: Student[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Barcodes')

  // Set up columns
  worksheet.columns = [
    { header: 'اسم الطالب', key: 'name', width: 30 },
    { header: 'رقم الطالب', key: 'id', width: 15 },
    { header: 'الباركود', key: 'barcode', width: 50 }
  ]

  // Fetch and add rows with barcodes
  for (const student of students) {
    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${student.id}&scale=3&includetext&textxalign=center`
    const response = await fetch(barcodeUrl)
    const buffer = await response.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    const imageId = workbook.addImage({
      base64: base64Image,
      extension: 'png',
    })

    worksheet.addRow({
      name: student.name,
      id: student.id
    })

    // Add image to the last row
    const rowNumber = worksheet.rowCount
    worksheet.addImage(imageId, {
      tl: { col: 2, row: rowNumber - 1 },
      ext: { width: 150, height: 50 }
    })
  }

  // Generate and download file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `student_barcodes_${new Date().toISOString()}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportStudentsToXLSX(students: Student[]) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Students')

  // Define columns
  worksheet.columns = [
    { header: 'اسم الطالب', key: 'name', width: 30 },
    { header: 'رقم الطالب', key: 'id', width: 15 },
    { header: 'الرقم القومي', key: 'national_id', width: 20 },
    { header: 'رقم الهاتف', key: 'phone', width: 15 },
    { header: 'نظام التعليم', key: 'education_sys', width: 15 },
    { header: 'السنة الدراسية', key: 'academic_year', width: 20 },
    { header: 'المركز', key: 'center', width: 20 },
    { header: 'المجموعة', key: 'group', width: 20 },
    { header: 'ملاحظات', key: 'notes', width: 30 }
  ]

  // Add rows
  students.forEach(student => {
    worksheet.addRow({
      name: student.name,
      id: student.id,
      national_id: student.national_id,
      phone: student.phone,
      education_sys: student.education_sys === "3am" ? "عام" : "أزهر",
      academic_year: student.academic_year,
      center: student.center_name,
      group: student.group_name,
      notes: student.notes
    })
  })

  // Style header row
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).alignment = { horizontal: 'center' }

  // Generate and download file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `students_export_${new Date().toISOString()}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}