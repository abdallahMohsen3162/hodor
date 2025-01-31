import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const font = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "متابعة مستر أحمد الأمير | نظام إدارة الحضور",
  description: "نظام متابعة مستر أحمد الأمير - إدارة حضور الطلاب بكفاءة وسهولة",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

