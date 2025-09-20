import { ref, readonly, onMounted } from 'vue'
import type { Employee, Absence, AbsenceDialogData, CalendarCell } from '../types/absence'

export const useAbsences = () => {
  // State
  const employees = ref<Employee[]>([])
  const absences = ref<Absence[]>([])
  const yearDates = ref<string[]>([])
  const dialogData = ref<AbsenceDialogData>({
    isOpen: false,
    mode: 'create'
  })

  // Generate sample data
  const generateSampleData = () => {
    const sampleEmployees: Employee[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', personnelNumber: 'EMP001' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', personnelNumber: 'EMP002' },
      { id: '3', firstName: 'Bob', lastName: 'Johnson', personnelNumber: 'EMP003' },
      { id: '4', firstName: 'Alice', lastName: 'Williams', personnelNumber: 'EMP004' },
      { id: '5', firstName: 'Charlie', lastName: 'Brown', personnelNumber: 'EMP005' },
      { id: '6', firstName: 'Diana', lastName: 'Davis', personnelNumber: 'EMP006' },
      { id: '7', firstName: 'Eve', lastName: 'Miller', personnelNumber: 'EMP007' },
      { id: '8', firstName: 'Frank', lastName: 'Wilson', personnelNumber: 'EMP008' },
      { id: '9', firstName: 'Grace', lastName: 'Moore', personnelNumber: 'EMP009' },
      { id: '10', firstName: 'Henry', lastName: 'Taylor', personnelNumber: 'EMP010' }
    ]

    const sampleAbsences: Absence[] = [
      {
        id: '1',
        employeeId: '1',
        startDate: '2025-01-15',
        endDate: '2025-01-17',
        type: 'sick',
        reason: 'Flu',
        createdAt: '2025-01-14T10:00:00Z',
        updatedAt: '2025-01-14T10:00:00Z'
      },
      {
        id: '2',
        employeeId: '2',
        startDate: '2025-02-05',
        endDate: '2025-02-07',
        type: 'vacation',
        reason: 'Holiday',
        createdAt: '2025-01-20T14:30:00Z',
        updatedAt: '2025-01-20T14:30:00Z'
      },
      {
        id: '3',
        employeeId: '3',
        startDate: '2025-03-10',
        endDate: '2025-03-10',
        type: 'personal',
        reason: 'Doctor appointment',
        createdAt: '2025-03-08T09:15:00Z',
        updatedAt: '2025-03-08T09:15:00Z'
      }
    ]

    employees.value = sampleEmployees
    absences.value = sampleAbsences
  }

  // Generate year dates
  const generateYearDates = (year: number = new Date().getFullYear()) => {
    const dates: string[] = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push(date.toISOString().split('T')[0])
    }

    return dates
  }

  // Check if date is weekend
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  // Check if date is today
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateString === today
  }

  // Get absence for employee on specific date
  const getAbsenceForDate = (employeeId: string, dateString: string): Absence | undefined => {
    return absences.value.find(absence => 
      absence.employeeId === employeeId &&
      dateString >= absence.startDate &&
      dateString <= absence.endDate
    )
  }

  // Generate calendar cells for an employee
  const generateCalendarCells = (employeeId: string, year: number = new Date().getFullYear()): CalendarCell[] => {
    const dates = generateYearDates(year)
    
    return dates.map(date => ({
      date,
      isAbsent: !!getAbsenceForDate(employeeId, date),
      absence: getAbsenceForDate(employeeId, date),
      isWeekend: isWeekend(date),
      isToday: isToday(date)
    }))
  }

  // Add new absence
  const addAbsence = (absenceData: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAbsence: Absence = {
      ...absenceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    absences.value.push(newAbsence)
    return newAbsence
  }

  // Update existing absence
  const updateAbsence = (id: string, updates: Partial<Omit<Absence, 'id' | 'createdAt'>>) => {
    const index = absences.value.findIndex(absence => absence.id === id)
    if (index !== -1) {
      const existingAbsence = absences.value[index]
      if (existingAbsence) {
        const updatedAbsence: Absence = {
          ...existingAbsence,
          ...updates as Omit<Absence, 'id' | 'createdAt'>,
          id: existingAbsence.id,
          createdAt: existingAbsence.createdAt,
          updatedAt: new Date().toISOString()
        }
        absences.value[index] = updatedAbsence
        return absences.value[index]
      }
    }
    return null
  }

  // Delete absence
  const deleteAbsence = (id: string) => {
    const index = absences.value.findIndex(absence => absence.id === id)
    if (index !== -1) {
      absences.value.splice(index, 1)
      return true
    }
    return false
  }

  // Open dialog
  const openDialog = (mode: 'create' | 'edit', employeeId?: string, date?: string, absence?: Absence) => {
    dialogData.value = {
      isOpen: true,
      mode,
      employeeId,
      date,
      absence
    }
  }

  // Close dialog
  const closeDialog = () => {
    dialogData.value = {
      isOpen: false,
      mode: 'create'
    }
  }

  // Initialize data only on client side
  onMounted(() => {
    const year = new Date().getFullYear()
    const dates: string[] = []
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]
      if (dateStr) dates.push(dateStr)
    }
    
    yearDates.value = dates
    generateSampleData()
  })

  return {
    // State
    employees,
    absences,
    dialogData: readonly(dialogData),
    yearDates: readonly(yearDates),
    
    // Methods
    generateCalendarCells,
    addAbsence,
    updateAbsence,
    deleteAbsence,
    openDialog,
    closeDialog,
    getAbsenceForDate
  }
}
