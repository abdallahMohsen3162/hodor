"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileDown, FileUp, FileSpreadsheet } from "lucide-react"
import { exportStudentsToXLSX, exportBarcodeSheet } from "@/utils/export-utils"
import type { Student } from "@/app/types"
import { useToast } from "@/components/ui/use-toast"

interface StudentsHeaderProps {
  onAddStudent: () => void
  onImport: () => void
  filteredStudents: Student[]
}

export function StudentsHeader({ onAddStudent, onImport, filteredStudents }: StudentsHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingBarcode, setIsExportingBarcode] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!filteredStudents || filteredStudents.length === 0) {
      toast({
        title: "لا يوجد طلاب للتصدير",
        description: "يرجى التأكد من وجود طلاب في القائمة قبل التصدير.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      exportStudentsToXLSX(filteredStudents)
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير بيانات الطلاب بنجاح.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "خطأ في التصدير",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportBarcodeSheet = async () => {
    if (!filteredStudents || filteredStudents.length === 0) {
      toast({
        title: "لا يوجد طلاب للتصدير",
        description: "يرجى التأكد من وجود طلاب في القائمة قبل تصدير الباركود.",
        variant: "destructive",
      })
      return
    }

    setIsExportingBarcode(true)
    try {
      await exportBarcodeSheet(filteredStudents)
      toast({
        title: "تم تصدير الباركود بنجاح",
        description: "تم تصدير كشف الباركود بنجاح.",
      })
    } catch (error) {
      console.error("Barcode export error:", error)
      toast({
        title: "خطأ في تصدير الباركود",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تصدير كشف الباركود",
        variant: "destructive",
      })
    } finally {
      setIsExportingBarcode(false)
    }
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button onClick={onAddStudent} className="bg-primary hover:bg-primary/90">
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة طالب جديد
        </Button>
        <Button variant="outline" onClick={onImport} className="border-primary/20 text-primary hover:bg-primary/5">
          <FileUp className="ml-2 h-4 w-4" />
          استيراد البيانات
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
          className="border-primary/20 text-primary hover:bg-primary/5"
        >
          <FileDown className="ml-2 h-4 w-4" />
          {isExporting ? "جاري التصدير..." : "تصدير البيانات (XLSX)"}
        </Button>
        <Button
          variant="outline"
          onClick={handleExportBarcodeSheet}
          disabled={isExportingBarcode}
          className="border-primary/20 text-primary hover:bg-primary/5"
        >
          <FileSpreadsheet className="ml-2 h-4 w-4" />
          {isExportingBarcode ? "جاري التصدير..." : "تصدير كشف الباركود"}
        </Button>
      </div>
    </div>
  )
}

