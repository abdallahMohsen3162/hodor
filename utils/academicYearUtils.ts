import { academicYears } from "@/app/constants/academicYears"

export function getAcademicYearLabel(value: string): string {
  const year = academicYears.find((y) => y.value === value)
  return year ? year.label : value
}

