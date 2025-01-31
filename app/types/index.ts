export interface User {
  id: number
  username: string
  role: string
}

export interface Center {
  id: number
  name: string
  location: string
  groups?: Group[]
}

export interface Group {
  id: number
  name: string
  center_id: number
  center_name?: string
  academic_year: string
  days: string[]
  times: string
  notes?: string
}

export interface Student {
  id: number
  name: string
  national_id: string
  phone: string
  education_sys: string
  center_id: number
  center_name: string
  group_id: number
  group_name: string
  notes: string
  academic_year: string
  parents: Parent[]
  attendance_records: AttendanceRecord[]
}

export interface Parent {
  id: number
  name: string
  phone: string
  relation: string
}


export interface ExamRecord {
  id: number
  student_id: number
  subject: string
  score: number
  total_score: number
  date: string
}

export interface AttendanceSession {
  id: string
  group_id: number
  date: string
  start_time: string
  end_time: string | null
  status: "active" | "ended"
}

export interface AttendanceReport {
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendanceByGroup: {
    groupName: string
    attendancePercentage: number
  }[]
  attendanceData: {
    studentId: string
    studentName: string
    status: "حاضر" | "غائب" | "متأخر"
    arrivalTime?: string
  }[]
}

export interface APIResponse<T> {
  data?: T
  error?: string
  message?: string
  status?: number
}

export interface StudyWeek {
  id: number
  name: string
  start_date: string
  end_date: string
}

export interface AttendanceRecord {
  id: number
  student_id: number
  student_name: string
  academic_year: string
  center_name: string
  group_name: string
  week_id: number
  status: 'attended' | 'late' | 'excused' | 'absent' | 'pending'
  arrival_time?: string
  excuse_reason?: string
  date: string
}

export interface StartRecordingPayload {
  group_id: number
  week_id: number
}

export interface MarkAttendancePayload {
  action: 'mark_attended' | 'mark_excused'
  student_id: number
  group_id: number
  week_id: number
  excuse_reason?: string
}

export interface EndRecordingPayload {
  group_id: number
  week_id: number
}

export interface UpdateAttendancePayload {
  attendance_id: number
  status: string
}