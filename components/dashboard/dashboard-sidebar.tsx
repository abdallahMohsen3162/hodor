"use client"

import { useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  BookOpen,
  Building2,
  FileBarChart2,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  Lock,
} from "lucide-react"
import { useSidebar } from "@/contexts/SidebarContext"
import { UserContext } from "@/app/contexts/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useContext(UserContext)
  const { isCollapsed, toggleSidebar } = useSidebar()

  const navItems = [
    { icon: Home, label: "الرئيسية", href: "/dashboard" },
    { icon: Users, label: "الطلاب", href: "/dashboard/students" },
    { icon: BookOpen, label: "الحضور", href: "/dashboard/attendance" },
    { icon: Building2, label: "السناتر والمجموعات", href: "/dashboard/centers-and-groups" },
    { icon: FileBarChart2, label: "الاختبارات", href: "/dashboard/exams", locked: true },
    { icon: Bell, label: "الإشعارات", href: "/dashboard/notifications", locked: true },
    { icon: FileText, label: "التقارير", href: "/dashboard/reports", locked: true },
  ]

  return (
    <div
      className={cn(
        "relative bg-background transition-all duration-300 ease-in-out pt-16 border-l",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        "flex flex-col h-full logo-shadow",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-300 shadow-sm hover:shadow"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>

      <ScrollArea className="flex-1 py-6 px-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.locked ? "#" : item.href}
              onClick={(e) => item.locked && e.preventDefault()}
            >
              <Button
                variant="ghost"
                className={cn(
                  "relative w-full justify-start",
                  isCollapsed ? "h-12 w-12" : "h-12 px-3",
                  pathname === item.href ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
                  "transition-all duration-200 ease-in-out",
                  item.locked && "opacity-50 cursor-not-allowed",
                )}
              >
                {pathname === item.href && (
                  <motion.div
                    className="absolute inset-0 rounded-md bg-primary z-0"
                    layoutId="sidebar-active-item"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 z-10", isCollapsed ? "mx-auto" : "mr-2")} />
                {!isCollapsed && (
                  <span className="z-10 flex items-center">
                    {item.label}
                    {item.locked && <Lock className="ml-2 h-4 w-4" />}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

