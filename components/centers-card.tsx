import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Center } from "@/app/types"

interface CenterCardProps {
  center: Center
  isSelected: boolean
  onSelect: (centerId: string) => void
}

export function CenterCard({ center, isSelected, onSelect }: CenterCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "border-primary" : ""}`}
      onClick={() => onSelect(center.id.toString())}
    >
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{center.name}</h3>
          <p className="text-sm text-muted-foreground">{center.location}</p>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">عدد المجموعات: {center.groups?.length || 0}</div>
            <Button variant="outline" size="sm">
              عرض المجموعات
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

