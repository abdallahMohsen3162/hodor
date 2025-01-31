"use client"

import { DashboardStatistics } from "@/components/dashboard/dashboard-statistics"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export function DashboardContent() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <DashboardStatistics />
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Overview />
        </div>
        <div className="col-span-3">
          <RecentActivity />
        </div>
      </div>
    </main>
  )
}

