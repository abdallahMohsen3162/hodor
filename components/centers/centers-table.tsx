import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Pencil } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Center } from "@/app/types"

interface CentersTableProps {
  centers: Center[]
  onDeleteCenter: (centerId: string) => void
  onEditCenter: (center: Center) => void
}

export function CentersTable({ centers, onDeleteCenter, onEditCenter }: CentersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [centerToDelete, setCenterToDelete] = useState<Center | null>(null)

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="بحث عن مركز..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المركز</TableHead>
              <TableHead>الموقع</TableHead>
              <TableHead>عدد المجموعات</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCenters.map((center) => (
              <TableRow key={center.id}>
                <TableCell>{center.name}</TableCell>
                <TableCell>{center.location}</TableCell>
                <TableCell>{center.groups?.length || 0}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEditCenter(center)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      تعديل
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setCenterToDelete(center)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!centerToDelete} onOpenChange={() => setCenterToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المركز؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المركز بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (centerToDelete) {
                  onDeleteCenter(centerToDelete.id.toString())
                  setCenterToDelete(null)
                }
              }}
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

