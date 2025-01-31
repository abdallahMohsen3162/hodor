import { Button } from "@/components/ui/button"
import type { Group, Center } from "@/app/types"

interface GroupsTableProps {
  groups: Group[]
  centers: Center[]
  onViewDetails: (groupId: string) => void
}

export function GroupsTable({ groups, centers, onViewDetails }: GroupsTableProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4 font-medium text-muted-foreground">
        <div>اسم المجموعة</div>
        <div>السنة الدراسية</div>
        <div>أيام الجدول</div>
        <div>المركز</div>
        <div>الإجراءات</div>
      </div>
      {groups.map((group) => (
        <div key={group.id} className="grid grid-cols-5 gap-4 py-3 border-b">
          <div>{group.name}</div>
          <div>{group.academic_year}</div>
          <div>{group.days.join(", ")}</div>
          <div>{centers.find((c) => c.id === group.center_id)?.name}</div>
          <div>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(group.id.toString())}>
              عرض التفاصيل
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

