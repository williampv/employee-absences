export interface Employee {
  id: string
  firstName: string
  lastName: string
  personnelNumber: string
}

export interface Absence {
  id: string
  employeeId: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  type: 'sick' | 'vacation' | 'personal' | 'other'
  reason?: string
  createdAt: string
  updatedAt: string
}

export interface AbsenceDialogData {
  isOpen: boolean
  employeeId?: string
  date?: string
  absence?: Absence
  mode: 'create' | 'edit'
}

export interface CalendarCell {
  date: string
  isAbsent: boolean
  absence?: Absence
  isWeekend: boolean
  isToday: boolean
}
