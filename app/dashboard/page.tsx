import { DashboardContent } from "@/components/dashboard/dashboard-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم | حضور",
  description: "لوحة التحكم الرئيسية لنظام حضور",
}

export default function DashboardPage() {
  return <DashboardContent />
}

