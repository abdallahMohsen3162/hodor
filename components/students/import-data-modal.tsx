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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { importStudentsFromXLSX } from "@/utils/data-export"
import type { Student } from "@/app/types"
import { useToast } from "@/components/ui/use-toast"

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Partial<Student>[]) => void
}

export function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await importStudentsFromXLSX(file)
      onImport(data)
      onClose()
      toast({
        title: "تم الاستيراد بنجاح",
        description: `تم استيراد ${data.length} طالب بنجاح.`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء استيراد البيانات")
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد البيانات. يرجى التحقق من الملف والمحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>استيراد البيانات</DialogTitle>
          <DialogDescription>
            قم بتحميل ملف XLSX يحتوي على بيانات الطلاب. يجب أن يحتوي الملف على الأعمدة التالية: الاسم، الرقم القومي، رقم
            الهاتف، السنة الدراسية، المركز، المجموعة، ملاحظات.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            إلغاء
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? "جاري الاستيراد..." : "استيراد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

