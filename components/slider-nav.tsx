"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const navItems = [
  { name: "لوحة التحكم", href: "/dashboard", icon: "🏠" },
  { name: "الطلاب", href: "/dashboard/students", icon: "👥" },
  { name: "الحضور", href: "/dashboard/attendance", icon: "📅" },
  { name: "المجموعات", href: "/dashboard/groups", icon: "👥" },
  { name: "المراكز", href: "/dashboard/centers", icon: "🏢" },
  { name: "التقارير", href: "/dashboard/reports", icon: "📊" },
]

export function SliderNav() {
  const pathname = usePathname()
  const [scrollPosition, setScrollPosition] = React.useState(0)
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = (direction: "left" | "right") => {
    if (scrollAreaRef.current) {
      const scrollAmount = 200
      const newScrollPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      scrollAreaRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      })
      setScrollPosition(newScrollPosition)
    }
  }

  return (
    <div className="relative">
      <ScrollArea ref={scrollAreaRef} className="w-full rounded-md border bg-background shadow-sm">
        <div className="flex w-max space-x-4 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "relative h-20 w-40 flex-col items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 hover:text-primary",
                )}
              >
                {pathname === item.href && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary"
                    layoutId="active-nav-item"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 text-2xl mb-2">{item.icon}</span>
                <span className="relative z-10 text-sm font-medium">{item.name}</span>
              </Button>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={() => handleScroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={() => handleScroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

