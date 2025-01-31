import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AttendanceTimerProps {
  startTime: Date
  maxLateTime: number
  setLate: (state: boolean) => void
}

export function AttendanceTimer({ startTime, maxLateTime, setLate }: AttendanceTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isLate, setIsLate] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
      setElapsedTime(elapsed)
      setIsLate(elapsed > maxLateTime * 60)
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, maxLateTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const remainingTime = Math.max(0, maxLateTime * 60 - elapsedTime)
  useEffect(() => {
    if(isLate){
      setLate(true)
    }
  }, [isLate])
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
        {!isLate && <div className="text-sm mt-2">الوقت المتبقي قبل التأخير: {formatTime(remainingTime)}</div>}
        {isLate && <div className="text-sm mt-2 text-red-500 font-bold">تجاوز وقت التأخير المسموح به</div>}
      </CardContent>
    </Card>
  )
}

