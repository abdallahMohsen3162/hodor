"use client";

import { academicYears } from "@/app/constants/academicYears";
import { useAddStudyWeekMutation, useGetStudyWeeksQuery } from "@/app/redux/features/attendanceApi";
import { useAddAttendanceMutation } from "@/app/redux/features/attendencesApi";
import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useGetCentersQuery } from "@/app/api/centersApi";
import { useGetAttendanceQuery } from "@/app/redux/attendanceApi";

export default function AttendanceManagement() {
  const [academicYear, setAcademicYear] = useState<string>("");
  const [stuNumber, setStuNumber] = useState<string>("");
  const {data: weaks} = useGetStudyWeeksQuery()
  const [openWeakModal, setOpenWeakModal] = useState(false);
  const [weekName, setWeekName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [addweak] = useAddStudyWeekMutation()
  const [groups, setGroups] = useState([]);
  const [center, setCenter] = useState<any>();
  const [centerList, setCenterList] = useState([]);
  const [group, setGroup] = useState<any>();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [weak, setWeakId] = useState<any>();
  const {data: attendance, refetch} = useGetAttendanceQuery({group_id: group, week_id: weak, academic_year: academicYear});
  console.log(weak, group, academicYear);
  console.log(attendance, "[][]");
  const [addAttendance] = useAddAttendanceMutation();
  const {data: centers} = useGetCentersQuery({});
  const [selectedStudent, setSelectedStudent] = useState<any>();

  useEffect(() => {
    if (centers) {
      setCenterList(centers);
    }
  }, [centers]);
  useEffect(() => {
    if (center) {
      setGroups(center.groups);
    }
  }, [center]);

  const Session = async (action: string) => {
    console.log(group, weak, academicYear);
    if(!group || !weak || !academicYear) return
    setSessionStarted(true)
    try {
      await addAttendance({
        action,
        group_id: group,
        week_id: weak,
        academic_year: academicYear,
        student_id: '',
        excuse_reason: '',

      }).then((result) => {
        refetch()
      })
    } catch (error) {
      
    }
  }
  
  const handleAddWeek = async () => {
    try {
      await addweak({
        name: weekName,
        start_date: startDate,
        end_date: new Date(Date.parse(startDate) + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      }).then((result) => {
        refetch()
      })
    } catch (error) {
      
    }
    setOpenWeakModal(false)
  }
  const handleAttendance = async (action: string, excuse_reason: string) => {
    console.log(selectedStudent);
    if(!selectedStudent) return
    
    try {
      await addAttendance({
        action,
        group_id: group,
        week_id: selectedStudent?.week_id,
        academic_year: selectedStudent?.academic_year,
        student_id: selectedStudent?.student_id,
        excuse_reason: excuse_reason,
      }).then((result) => {
        refetch()
        setSelectedStudent(null)
      })
    } catch (error) {
      
    }
  }

  const handleChangeCenter = (id: string) => {
    setCenter(centers?.find((center: any) => center.id === Number(id)))
    refetch()
  }

  // start_recording
  // mark_attended
  // mark_excused
  // end_recording

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">إدارة الحضور</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select 
        onChange={(e) => setAcademicYear(e.target.value)}
        className="bg-gray-800 p-2 rounded text-white">
          <option value="">
            --- اختر السنة الدراسية ---
          </option>
          {academicYears.map((year) => (
            <option value={year.value} key={year.value}>{year.label}</option>
          ))}
        </select>
        <select name="" id="" onChange={(e) => {
            handleChangeCenter(e.target.value)
            
          }} className="bg-gray-800 p-2 rounded text-white">
            <option value=""> 
              --- اختر المركز ---
            </option>
            {
              centerList?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} </option>
              ))
            }
  
        </select>
        <select onChange={(e) => setGroup(e.target.value)} className="bg-gray-800 p-2 rounded text-white">
          
            <option value=""></option>
            {
              groups.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))
            }
     
        </select>
        <div className="flex items-center bg-gray-800 p-2 rounded">
          <button onClick={() => setOpenWeakModal(true)} className="px-2 text-lg">+</button>
         <select onChange={(e) => setWeakId(e.target.value)} name="" id="">
          {
            weaks?.map((week) => (
              <option key={week.id} value={week.id}>{week.name}</option>
            ))
          }
         </select>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="number" placeholder="الحد الأقصى للتأخير (بالدقائق)" className="bg-gray-800 p-2 rounded text-white w-full" />
        <input type="date" className="bg-gray-800 p-2 rounded text-white w-full" />
      </div> */}
      <div className="flex gap-4 mb-4">
        <button
          disabled={sessionStarted}
          className={`bg-blue-600 px-4 py-2 rounded ${sessionStarted ? 'bg-gray-600' : ''}`}
          onClick={() => Session('start_recording')}
        >
          بدء تسجيل الحضور
        </button>
        <button
          onClick={() => Session('end_recording')}
          disabled={!sessionStarted}
          className={`bg-gray-600 px-4 py-2 rounded ${sessionStarted ? 'bg-blue-600' : ''}`}
        >
          إنهاء تسجيل الحضور
        </button>
      </div>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <h3 className="text-lg font-bold">إدخال يدوي</h3>
        <input onChange={(e) => setStuNumber(e.target.value)} type="text" placeholder="أدخل رقم" className="bg-gray-700 p-2 rounded text-white w-full mt-2" />
        <button className="bg-green-600 px-4 py-2 rounded mt-2 w-full">تسجيل حضور</button>
      </div>
      <table className="w-full border-collapse mt-4">
  <thead>
    <tr className="bg-gray-700 text-white">
      <th className="p-2">رقم الطالب</th>
      <th className="p-2">اسم الطالب</th>
      <th className="p-2">الحالة</th>
      <th className="p-2">وقت الوصول</th>
      <th className="p-2">سبب الغياب</th>
    </tr>
  </thead>
  <tbody>
    {attendance?.map((a: any) => (
      <tr key={a.id} className="border-t border-gray-600 text-center">
        <td className="p-2">{a.student_id}</td>
        <td className="p-2">{a.student_name}</td>
        <td className="p-2">
          <span
            className={`px-2 py-1 rounded text-white
              ${a.status === "attended" ? "bg-green-500" : ""}
              ${a.status === "late" ? "bg-yellow-500" : ""}
              ${a.status === "pending" ? "bg-gray-500" : ""}
              ${a.status === "excused" ? "bg-blue-500" : ""}
              ${a.status === "absent" ? "bg-red-500" : ""}
            `}
          >
            {a.status === "attended" && "حاضر"}
            {a.status === "late" && "متأخر"}
            {a.status === "excused" && "معذور"}
            {a.status === "absent" && "غائب"}
            {a.status === "pending" && "قيد الانتظار"}
          </span>
        </td>
        <td className="p-2">{a.arrival_time?.split(".")[0] || "—"}</td>
        <td className="p-2">{a.excuse_reason || "لا يوجد"}</td>
        <td>
          <button 
          onClick={() => setSelectedStudent(a)}
          className="bg-blue-500 text-white py-2 px-4 rounded">
            تعديل
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>



      <Modal isOpen={openWeakModal} onClose={() => setOpenWeakModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add Weak</h2>
          <label className="block mb-2">
            Name:
            <input
              onChange={(e) => setWeekName(e.target.value)}
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter name"
            />
          </label>
          <label className="block mb-2">
            Start Date:
            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full p-2 border rounded"
            />
          </label>
          <button

            className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            onClick={() => handleAddWeek()}
          >
            Save
          </button>
        </div>
      </Modal>

   
        <Modal isOpen={selectedStudent} onClose={() => setSelectedStudent(null)}>
          <div className="p-4 bg-black text-white">
            <h2 className="text-lg font-semibold mb-4 ">
              Are you sure you want to delete this student?
            </h2>
            <button
              onClick={() => handleAttendance("mark_attended", '')}
              className="mt-4 w-full bg-green-500 py-2 rounded"
            >
              حضر
            </button>
            <button
              onClick={(e) => {
                const prompt = window.prompt("Enter excuse reason") || "";
                handleAttendance("mark_excused", prompt)
              }}
              className="mt-4 w-full bg-red-500 py-2 rounded"
            >
              غايب
            </button>
          </div>
        </Modal>

    </div>
  );
}