import type React from "react"

export default function CentersAndGroupsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">{children}</div>
    </div>
  )
}

