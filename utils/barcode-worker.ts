import { jsPDF } from "jspdf"
import "jspdf-autotable"
import type { Student } from "@/app/types"

self.onmessage = (event: MessageEvent) => {
  const { students } = event.data as { students: Student[] }

  try {
    if (!Array.isArray(students)) {
      throw new Error("Invalid students data: not an array")
    }

    if (students.length === 0) {
      throw new Error("Empty students array")
    }

    const doc = new jsPDF()

    // Add logo
    try {
      doc.addImage(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-z9ZyXh4FkexcdPZBwEOL5jiTI2jEEa.png",
        "PNG",
        15,
        10,
        180,
        30,
      )
    } catch (err) {
      console.error("Error adding logo:", err)
      // Continue without the logo
    }

    // Add title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("كشف باركود الطلاب", 105, 50, { align: "center" })

    // Add date
    doc.setFontSize(12)
    doc.text(`تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG")}`, 105, 60, { align: "center" })

    // Add student barcodes
    let y = 70
    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      try {
        if (y > 250) {
          doc.addPage()
          y = 20
        }

        // Add student info
        doc.setFontSize(12)
        doc.text(`${student.name} - ID: ${student.id}`, 105, y, { align: "center" })

        // Add barcode
        const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${student.id}&scale=3&includetext&textxalign=center`
        doc.addImage(barcodeUrl, "PNG", 65, y + 5, 80, 30)

        y += 45
      } catch (err) {
        console.error(`Error processing student ${i}:`, err)
        // Continue with the next student
      }
    }

    const pdfOutput = doc.output("arraybuffer")

    if (!pdfOutput || pdfOutput.byteLength === 0) {
      throw new Error("Generated PDF is empty")
    }

    self.postMessage({ pdfOutput })
  } catch (error) {
    console.error("Error in barcode worker:", error)
    self.postMessage({
      error: error instanceof Error ? error.message : "Unknown error occurred during barcode PDF generation",
    })
  }
}

