"use client"

import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ErrorBoundary } from "@/components/error-boundary"
import { SidebarProvider } from "@/contexts/SidebarContext"
import { UserProvider } from "@/app/contexts/UserContext"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<LoadingSpinner />}>
          <UserProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </UserProvider>
        </Suspense>
      </Provider>
    </ErrorBoundary>
  )
}

