import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إدارة المراكز | حضور",
  description: "إدارة المراكز في نظام حضور",
}

export default function CentersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة المراكز</h1>
      </div>
      {children}
    </div>
  )
}

