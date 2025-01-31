import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function AttendanceHeader() {
  const { toast } = useToast()

  const handleExportData = () => {
    // هنا يمكنك إضافة المنطق الفعلي لتصدير البيانات
    // هذا مجرد مثال بسيط
    const dummyData = [
      { id: 1, name: "أحمد محمد", status: "حاضر" },
      { id: 2, name: "فاطمة علي", status: "غائب" },
      // ... المزيد من البيانات
    ]

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "الرقم,الاسم,الحالة\n" +
      dummyData.map((row) => `${row.id},${row.name},${row.status}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "attendance_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات الحضور بنجاح.",
    })
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">إدارة الحضور - التفاصيل الكاملة</h1>
        <p className="text-muted-foreground">إدارة الحضور حسب السنة الدراسية والمركز والمجموعة مع عرض تفصيلي</p>
      </div>
      <Button variant="outline" onClick={handleExportData}>
        <FileDown className="ml-2 h-4 w-4" />
        تصدير البيانات
      </Button>
    </div>
  )
}

