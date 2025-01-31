import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceStatsProps {
  attendanceRate: number
}

export function AttendanceStats({ attendanceRate }: AttendanceStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إحصائيات الحضور</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{attendanceRate.toFixed(2)}%</div>
        <p className="text-xs text-muted-foreground">نسبة الحضور</p>
      </CardContent>
    </Card>
  )
}

