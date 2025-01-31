"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, BarChart2, Building2, UsersRound } from "lucide-react"

const navigation = [
  { name: "الطلاب", href: "/dashboard/students", icon: Users },
  { name: "المراكز", href: "/dashboard/centers", icon: Building2 },
  { name: "المجموعات", href: "/dashboard/groups", icon: UsersRound },
  { name: "التقارير", href: "/dashboard/reports", icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-l">
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-secondary")}
              >
                <item.icon className="ml-2 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

