"use client"

import { useState, useEffect, useCallback } from "react"
import { AttendanceHeader } from "./attendance-header"
import { AttendanceFilters } from "./attendance-filters"
import { AttendanceTable } from "./attendance-table"
import { ManualEntryPanel } from "./manual-entry-panel"
import { AttendanceCharts } from "./attendance-charts"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  useStartAttendanceSessionMutation,
  useEndAttendanceSessionMutation,
  useMarkAttendanceMutation,
  useGetAttendanceReportQuery,
} from "@/app/redux/features/studentsApi"
import { API_BASE_URL } from "@/app/config/api"

export function AttendancePage() {
  const [academicYear, setAcademicYear] = useState<string | undefined>(undefined)
  const [selectedCenter, setSelectedCenter] = useState<string | undefined>(undefined)
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined)
  const [sessionDuration, setSessionDuration] = useState<string>("60")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(60 * 60)
  const [isConfirmStartDialogOpen, setIsConfirmStartDialogOpen] = useState(false)
  const [isConfirmEndDialogOpen, setIsConfirmEndDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [barcode, setBarcode] = useState("")
  const [isStartingSession, setIsStartingSession] = useState(false)

  const { toast } = useToast()

  const [startAttendanceSession] = useStartAttendanceSessionMutation()
  const [endAttendanceSession] = useEndAttendanceSessionMutation()
  const [markAttendance] = useMarkAttendanceMutation()
  const { data: attendanceReport, refetch: refetchAttendanceReport } = useGetAttendanceReportQuery(
    { groupId: selectedGroup || "", date: selectedDate.toISOString().split("T")[0] },
    { skip: !selectedGroup || !selectedDate },
  )

  const checkApiConnection = async () => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not set. Please check your environment variables.")
      toast({
        title: "خطأ في التكوين",
        description: "لم يتم تعيين عنوان URL الأساسي للـ API. يرجى التحقق من متغيرات البيئة الخاصة بك.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/health-check`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API health check failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log("API health check successful:", data)
    } catch (error) {
      console.error("API connection error:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  const retryApiConnection = async (retries = 3, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await checkApiConnection()
        return // Success, exit the retry loop
      } catch (error) {
        console.error(`API connection attempt ${i + 1} failed:`, error)
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }
    console.error(`API connection failed after ${retries} attempts`)
  }

  useEffect(() => {
    retryApiConnection()
  }, [retryApiConnection]) // Added retryApiConnection to the dependency array

  useEffect(() => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not set. Please check your environment variables.")
      toast({
        title: "خطأ في التكوين",
        description: "لم يتم تعيين عنوان URL الأساسي للـ API. يرجى التحقق من متغيرات البيئة الخاصة بك.",
        variant: "destructive",
      })
    }
  }, [API_BASE_URL, toast]) // Added API_BASE_URL and toast to the dependency array

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSessionActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (remainingTime === 0) {
      handleEndSession()
    }
    return () => clearInterval(timer)
  }, [isSessionActive, remainingTime])

  const handleStartSession = () => {
    if (!selectedGroup || !academicYear) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المجموعة والسنة الدراسية قبل بدء الجلسة",
        variant: "destructive",
      })
      return
    }
    if (!selectedDate) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار التاريخ قبل بدء الجلسة",
        variant: "destructive",
      })
      return
    }
    setIsConfirmStartDialogOpen(true)
  }

  const confirmStartSession = async () => {
    if (selectedGroup && selectedDate) {
      setIsStartingSession(true)
      try {
        const result = await startAttendanceSession({
          groupId: selectedGroup,
          date: selectedDate.toISOString().split("T")[0],
          academicYear: academicYear || "",
        }).unwrap()
        if (result && result.sessionId) {
          setSessionId(result.sessionId)
          setIsSessionActive(true)
          setRemainingTime(Number.parseInt(sessionDuration) * 60)
          setIsConfirmStartDialogOpen(false)
          toast({
            title: "بدأت الجلسة",
            description: `بدأت جلسة جديدة لمدة ${sessionDuration} دقيقة.`,
          })
        } else {
          throw new Error("Invalid response from server")
        }
      } catch (error) {
        console.error("Error starting session:", error)
        let errorMessage = "حدث خطأ أثناء بدء الجلسة. يرجى المحاولة مرة أخرى."
        if (error instanceof Error) {
          errorMessage += ` السبب: ${error.message}`
        }
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsStartingSession(false)
      }
    } else {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المجموعة والتاريخ قبل بدء الجلسة",
        variant: "destructive",
      })
    }
  }

  const handleEndSession = () => {
    setIsConfirmEndDialogOpen(true)
  }

  const confirmEndSession = async () => {
    if (sessionId) {
      try {
        await endAttendanceSession({ sessionId }).unwrap()
        setIsSessionActive(false)
        setSessionId(null)
        setIsConfirmEndDialogOpen(false)
        refetchAttendanceReport()
        toast({
          title: "انتهت الجلسة",
          description: "تم إنهاء الجلسة بنجاح.",
        })
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إنهاء الجلسة. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        })
      }
    }
  }

  const handleBarcodeInput = useCallback(
    async (inputBarcode: string) => {
      if (sessionId) {
        try {
          await markAttendance({ sessionId, barcode: inputBarcode }).unwrap()
          toast({
            title: "تم تسجيل الحضور",
            description: `تم تسجيل حضور الطالب برقم الباركود ${inputBarcode}`,
          })
          refetchAttendanceReport()
        } catch (error) {
          toast({
            title: "خطأ",
            description: "حدث خطأ أثناء تسجيل الحضور. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          })
        }
      }
    },
    [sessionId, markAttendance, toast, refetchAttendanceReport],
  )

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isSessionActive && event.key === "Enter" && barcode) {
        handleBarcodeInput(barcode)
        setBarcode("")
      } else if (isSessionActive && event.key !== "Enter") {
        setBarcode((prev) => prev + event.key)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isSessionActive, barcode, handleBarcodeInput])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <AttendanceHeader />
      <AttendanceFilters
        academicYear={academicYear}
        setAcademicYear={setAcademicYear}
        selectedCenter={selectedCenter}
        setSelectedCenter={setSelectedCenter}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        sessionDuration={sessionDuration}
        setSessionDuration={setSessionDuration}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="flex justify-between items-center">
        <Button
          onClick={handleStartSession}
          disabled={!selectedGroup || !selectedDate || isSessionActive || !academicYear}
        >
          بدء الجلسة
        </Button>
        {isSessionActive && (
          <>
            <div className="text-2xl font-bold">الوقت المتبقي: {formatTime(remainingTime)}</div>
            <Button onClick={handleEndSession} variant="destructive">
              إنهاء الجلسة
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-6">
        <div className="flex-grow">
          <AttendanceTable attendanceData={attendanceReport?.attendanceData || []} isSessionActive={isSessionActive} />
        </div>
        <div className="w-64">
          <ManualEntryPanel
            isSessionActive={isSessionActive}
            onAttendanceUpdate={handleBarcodeInput}
            students={attendanceReport?.attendanceData || []}
            selectedDate={selectedDate}
          />
        </div>
      </div>
      <AttendanceCharts attendanceReport={attendanceReport} />

      <Dialog open={isConfirmStartDialogOpen} onOpenChange={setIsConfirmStartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد بدء الجلسة</DialogTitle>
            <DialogDescription>هل أنت متأكد أنك تريد بدء جلسة جديدة لمدة {sessionDuration} دقيقة؟</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmStartDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={confirmStartSession} disabled={isStartingSession}>
              {isStartingSession ? "جاري بدء الجلسة..." : "تأكيد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmEndDialogOpen} onOpenChange={setIsConfirmEndDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد إنهاء الجلسة</DialogTitle>
            <DialogDescription>هل أنت متأكد أنك تريد إنهاء الجلسة الحالية؟</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmEndDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmEndSession}>
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

