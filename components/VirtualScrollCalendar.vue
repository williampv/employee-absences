<template>
  <div class="virtual-scroll-calendar">
    <AbsenceCalendarTable
      :employees="visibleEmployees"
      :visible-dates="visibleDates"
      :visible-employees="visibleEmployees"
      :get-absence-for-date="getAbsenceForDate"
      @cell-click="handleCellClick"
      @scroll="handleScroll"
    />
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '../types/absence'
import AbsenceCalendarTable from '../components/AbsenceCalendarTable.vue'

interface Props {
  employees: Employee[]
  getAbsenceForDate: (employeeId: string, date: string) => any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cellClick: [employeeId: string, date: string]
}>()

// Virtual scrolling configuration for employees only
const ITEMS_PER_PAGE = 20

// Current visible ranges
const visibleEmployeeStart = ref(0)

// Generate all dates for the current year
const allDates = computed(() => {
  const dates: string[] = []
  const year = new Date().getFullYear()
  
  // Generate date strings directly without Date objects to avoid timezone issues
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      dates.push(`${year}-${monthStr}-${dayStr}`)
    }
  }

  return dates
})

// Visible employees (virtual scrolling for large employee lists)
const visibleEmployees = computed(() => {
  const end = Math.min(visibleEmployeeStart.value + ITEMS_PER_PAGE, props.employees.length)
  return props.employees.slice(visibleEmployeeStart.value, end)
})

// Show all dates for the year (no virtual scrolling for dates)
const visibleDates = computed(() => {
  return allDates.value
})

// Handle cell click
const handleCellClick = (employeeId: string, date: string) => {
  emit('cellClick', employeeId, date)
}

// Handle scroll events for virtual scrolling (employees only)
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  
  // Calculate visible employee range based on scroll position
  const employeeItemHeight = 60 // Height of each employee row
  const newEmployeeStart = Math.floor(scrollTop / employeeItemHeight)
  
  if (newEmployeeStart !== visibleEmployeeStart.value) {
    visibleEmployeeStart.value = Math.max(0, newEmployeeStart - 5) // Buffer of 5 items
  }
}

// Reset scroll position when data changes
watch(() => props.employees.length, () => {
  visibleEmployeeStart.value = 0
})
</script>

<style scoped>
.virtual-scroll-calendar {
  width: 100%;
  height: 100%;
}
</style>
