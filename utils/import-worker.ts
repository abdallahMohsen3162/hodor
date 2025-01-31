import * as XLSX from "xlsx"

self.onmessage = (event) => {
  const { content, type } = event.data

  try {
    if (type !== "xlsx") {
      throw new Error("Unsupported file type. Please use XLSX format.")
    }

    const workbook = XLSX.read(content, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Assuming the first row is headers
    const headers = data[0]
    const students = data.slice(1).map((row: any[]) => {
      const student: any = {}
      headers.forEach((header: string, index: number) => {
        student[header] = row[index]
      })
      return student
    })

    self.postMessage({ students })
  } catch (error) {
    console.error("Error in import worker:", error)
    self.postMessage({ error: error instanceof Error ? error.message : "Unknown error occurred during import" })
  }
}

