"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, Bar } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import type { AttendanceRecord } from "@/app/types" // Assuming AttendanceRecord type is defined
import { Alert, AlertDescription } from "@/components/ui/alert"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface AttendanceChartsProps {
  attendanceData: AttendanceRecord[]
}

export function AttendanceCharts({ attendanceData }: AttendanceChartsProps) {
  if (!attendanceData || attendanceData.length === 0) {
    return (
      <Alert>
        <AlertDescription>لا توجد بيانات حضور متاحة حالياً.</AlertDescription>
      </Alert>
    )
  }

  const presentCount = attendanceData.filter((record) => record.status === "present").length
  const absentCount = attendanceData.filter((record) => record.status === "absent").length
  const lateCount = attendanceData.filter((record) => record.status === "late").length

  const pieData = {
    labels: ["حاضر", "غائب", "متأخر"],
    datasets: [
      {
        data: [presentCount, absentCount, lateCount],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#e53935", "#ffb300"],
      },
    ],
  }

  //const barData = { //Removed bar chart related code
  //  labels: attendanceReport.attendanceByGroup.map((group) => group.groupName),
  //  datasets: [
  //    {
  //      label: "نسبة الحضور",
  //      data: attendanceReport.attendanceByGroup.map((group) => group.attendancePercentage),
  //      backgroundColor: "#2196F3",
  //    },
  //  ],
  //}

  //const barOptions = { //Removed bar chart related code
  //  responsive: true,
  //  plugins: {
  //    legend: {
  //      position: "top" as const,
  //    },
  //    title: {
  //      display: true,
  //      text: "نسبة الحضور حسب المجموعة",
  //    },
  //  },
  //  scales: {
  //    y: {
  //      beginAtZero: true,
  //      max: 100,
  //      title: {
  //        display: true,
  //        text: "النسبة المئوية",
  //      },
  //    },
  //  },
  //}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>توزيع الحضور</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie data={pieData} />
        </CardContent>
      </Card>
      {/* Removed Bar chart Card */}
      {/*<Card>
        <CardHeader>
          <CardTitle>نسبة الحضور حسب المجموعة</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={barOptions} data={barData} />
        </CardContent>
      </Card>*/}
    </div>
  )
}

