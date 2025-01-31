"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetCentersQuery, useGetGroupsQuery } from "@/app/redux/features/studentsApi"
import type { Center, Group } from "@/app/types"
import { academicYears } from "@/app/constants/academicYears"

interface StudentsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  academicYearFilter: string
  setAcademicYearFilter: (year: string) => void
  centerFilter: string
  setCenterFilter: (center: string) => void
  groupFilter: string
  setGroupFilter: (group: string) => void
  educationSysFilter: string
  setEducationSysFilter: (sys: string) => void
}

export function StudentsFilters({
  searchTerm,
  setSearchTerm,
  academicYearFilter,
  setAcademicYearFilter,
  centerFilter,
  setCenterFilter,
  groupFilter,
  setGroupFilter,
  educationSysFilter,
  setEducationSysFilter,
}: StudentsFiltersProps) {
  const { data: centers } = useGetCentersQuery()
  const { data: groups, refetch: refetchGroups } = useGetGroupsQuery(
    {
      centerId: centerFilter !== "all" ? centerFilter : undefined,
      academicYear: academicYearFilter !== "all" ? academicYearFilter : undefined,
    },
    { skip: centerFilter === "all" || academicYearFilter === "all" },
  )

  useEffect(() => {
    if (centerFilter !== "all" && academicYearFilter !== "all") {
      refetchGroups()
    }
    setGroupFilter("all")
  }, [centerFilter, academicYearFilter, refetchGroups, setGroupFilter])

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">بحث</Label>
        <Input
          id="search"
          placeholder="ابحث عن طالب بالاسم أو رقم الطالب أو الرقم القومي أو رقم الهاتف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="academicYear">السنة الدراسية</Label>
          <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
            <SelectTrigger id="academicYear">
              <SelectValue placeholder="اختر السنة الدراسية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع السنوات</SelectItem>
              {academicYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="center">المركز</Label>
          <Select value={centerFilter} onValueChange={setCenterFilter}>
            <SelectTrigger id="center">
              <SelectValue placeholder="اختر المركز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراكز</SelectItem>
              {centers?.map((center) => (
                <SelectItem key={center.id} value={center.id.toString()}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="group">المجموعة</Label>
          <Select
            value={groupFilter}
            onValueChange={setGroupFilter}
            disabled={centerFilter === "all" || academicYearFilter === "all"}
          >
            <SelectTrigger id="group">
              <SelectValue placeholder="اختر المجموعة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المجموعات</SelectItem>
              {groups?.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="educationSys">نظام التعليم</Label>
          <Select value={educationSysFilter} onValueChange={setEducationSysFilter}>
            <SelectTrigger id="educationSys">
              <SelectValue placeholder="اختر نظام التعليم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="3am">عام</SelectItem>
              <SelectItem value="azhar">أزهر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

