"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded-full">
        <Wifi size={24} />
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full">
      <WifiOff size={24} />
    </div>
  )
}

