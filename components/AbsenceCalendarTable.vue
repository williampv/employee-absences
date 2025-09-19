<template>
  <div class="absence-calendar-table">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <h2>Employee Absences Calendar</h2>
        <v-chip color="primary" variant="outlined">
          {{ currentYear }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <div class="calendar-container">
          <!-- Fixed header with employee info and date columns -->
          <div class="calendar-header">
            <div class="employee-info-header">
              <div class="header-cell employee-name">Employee</div>
              <div class="header-cell personnel-number">Personnel #</div>
            </div>
            <div class="dates-header" ref="datesHeader">
              <div
                v-for="date in visibleDates"
                :key="date"
                class="date-header-cell"
                :class="{
                  'weekend': isWeekend(date),
                  'today': isToday(date)
                }"
              >
                <div class="date-number">{{ getDayNumber(date) }}</div>
                <div class="date-month">{{ getMonthAbbr(date) }}</div>
              </div>
            </div>
          </div>

          <!-- Virtual scrolling container -->
          <div class="calendar-body" ref="calendarBody" @scroll="handleScroll">
            <div
              v-for="employee in visibleEmployees"
              :key="employee.id"
              class="employee-row"
            >
              <!-- Employee info -->
              <div class="employee-info">
                <div class="employee-name">
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <span v-bind="props">{{ employee.firstName }} {{ employee.lastName }}</span>
                    </template>
                    <span>Click cells to manage absences</span>
                  </v-tooltip>
                </div>
                <div class="personnel-number">{{ employee.personnelNumber }}</div>
              </div>

              <!-- Calendar cells -->
              <div class="calendar-cells">
                <div
                  v-for="date in visibleDates"
                  :key="`${employee.id}-${date}`"
                  class="calendar-cell"
                  :class="getCellClasses(employee.id, date)"
                  @click="handleCellClick(employee.id, date)"
                >
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <div v-bind="props" class="cell-content">
                        <v-icon
                          v-if="getAbsenceForDate(employee.id, date)"
                          size="small"
                          :color="getAbsenceTypeColor(getAbsenceForDate(employee.id, date)?.type)"
                        >
                          {{ getAbsenceTypeIcon(getAbsenceForDate(employee.id, date)?.type) }}
                        </v-icon>
                      </div>
                    </template>
                    <div>
                      <div><strong>{{ formatDate(date) }}</strong></div>
                      <div v-if="getAbsenceForDate(employee.id, date)">
                        {{ getAbsenceForDate(employee.id, date)?.type }} - {{ getAbsenceForDate(employee.id, date)?.reason }}
                      </div>
                      <div v-else-if="isWeekend(date)">Weekend</div>
                      <div v-else>Present</div>
                    </div>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <v-card class="mt-4" variant="outlined">
          <v-card-text>
            <div class="d-flex align-center gap-4 flex-wrap">
              <div class="legend-item">
                <v-icon color="success" size="small">mdi-check</v-icon>
                <span>Present</span>
              </div>
              <div class="legend-item">
                <v-icon color="error" size="small">mdi-close</v-icon>
                <span>Absent</span>
              </div>
              <div class="legend-item">
                <v-icon color="grey" size="small">mdi-minus</v-icon>
                <span>Weekend</span>
              </div>
              <div class="legend-item">
                <v-icon color="info" size="small">mdi-calendar-today</v-icon>
                <span>Today</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '../types/absence'

interface Props {
  employees: Employee[]
  visibleDates: string[]
  visibleEmployees: Employee[]
  onCellClick: (employeeId: string, date: string) => void
  getAbsenceForDate: (employeeId: string, date: string) => any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  scroll: [event: Event]
}>()

// Reactive refs
const calendarBody = ref<HTMLElement>()
const datesHeader = ref<HTMLElement>()

// Current year
const currentYear = new Date().getFullYear()

// Utility functions
const isWeekend = (dateString: string) => {
  // Create date using local timezone to avoid timezone shifts
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

const isToday = (dateString: string) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayString = `${year}-${month}-${day}`
  return dateString === todayString
}

const getDayNumber = (dateString: string) => {
  // Extract day from YYYY-MM-DD format without creating Date object
  return parseInt(dateString.split('-')[2])
}

const getMonthAbbr = (dateString: string) => {
  // Extract month from YYYY-MM-DD format and convert to month name
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en', { month: 'short' })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCellClasses = (employeeId: string, date: string) => {
  const absence = props.getAbsenceForDate(employeeId, date)
  const classes = []
  
  if (absence) {
    classes.push('absent')
  } else if (isWeekend(date)) {
    classes.push('weekend')
  } else {
    classes.push('present')
  }
  
  if (isToday(date)) {
    classes.push('today')
  }
  
  return classes.join(' ')
}

const getAbsenceTypeColor = (type?: string) => {
  const colors: Record<string, string> = {
    sick: 'error',
    vacation: 'warning',
    personal: 'info',
    other: 'grey'
  }
  return colors[type || ''] || 'error'
}

const getAbsenceTypeIcon = (type?: string) => {
  const icons: Record<string, string> = {
    sick: 'mdi-medical-bag',
    vacation: 'mdi-beach',
    personal: 'mdi-account',
    other: 'mdi-help'
  }
  return icons[type || ''] || 'mdi-help'
}

const handleCellClick = (employeeId: string, date: string) => {
  if (!isWeekend(date)) {
    props.onCellClick(employeeId, date)
  }
}

const handleScroll = (event: Event) => {
  // Sync horizontal scrolling between header and body
  if (datesHeader.value && calendarBody.value) {
    datesHeader.value.scrollLeft = (event.target as HTMLElement).scrollLeft
  }
  
  emit('scroll', event)
}

// Watch for scroll sync
watch(() => calendarBody.value?.scrollLeft, (newScrollLeft) => {
  if (datesHeader.value && newScrollLeft !== undefined) {
    datesHeader.value.scrollLeft = newScrollLeft
  }
})
</script>

<style scoped>
.absence-calendar-table {
  width: 100%;
}

.calendar-container {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: sticky;
  top: 0;
  z-index: 10;
}

.employee-info-header {
  display: flex;
  min-width: 280px;
  background-color: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.header-cell {
  padding: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  display: flex;
  align-items: center;
}

.employee-name {
  flex: 1;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.personnel-number {
  min-width: 120px;
  text-align: center;
}

.dates-header {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.dates-header::-webkit-scrollbar {
  display: none;
}

.date-header-cell {
  min-width: 40px;
  width: 40px;
  padding: 8px 4px;
  text-align: center;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.date-header-cell.weekend {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.date-header-cell.today {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.date-number {
  font-weight: 500;
  line-height: 1;
}

.date-month {
  font-size: 0.65rem;
  opacity: 0.8;
  line-height: 1;
  margin-top: 2px;
}

.calendar-body {
  max-height: 600px;
  overflow: auto;
  scrollbar-width: thin;
}

.employee-row {
  display: flex;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  min-height: 60px;
}

.employee-row:last-child {
  border-bottom: none;
}

.employee-info {
  display: flex;
  min-width: 280px;
  background-color: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: sticky;
  left: 0;
  z-index: 5;
}

.employee-info .employee-name {
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  font-weight: 500;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.employee-info .personnel-number {
  min-width: 120px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.calendar-cells {
  display: flex;
}

.calendar-cell {
  min-width: 40px;
  width: 40px;
  height: 60px;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.calendar-cell.present {
  background-color: rgba(var(--v-theme-success), 0.1);
}

.calendar-cell.absent {
  background-color: rgba(var(--v-theme-error), 0.2);
}

.calendar-cell.weekend {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  cursor: not-allowed;
}

.calendar-cell.today {
  border: 2px solid rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.3);
}

.calendar-cell:hover:not(.weekend) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.05);
  z-index: 1;
}

.cell-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.gap-4 {
  gap: 16px;
}

@media (max-width: 768px) {
  .employee-info-header {
    min-width: 200px;
  }
  
  .employee-info {
    min-width: 200px;
  }
  
  .header-cell.employee-name {
    font-size: 0.75rem;
  }
  
  .employee-info .employee-name {
    font-size: 0.875rem;
  }
  
  .date-header-cell {
    min-width: 32px;
    width: 32px;
  }
  
  .calendar-cell {
    min-width: 32px;
    width: 32px;
  }
}
</style>
