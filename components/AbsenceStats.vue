<template>
  <v-row class="mb-4">
    <v-col cols="12" md="3">
      <v-card color="success" variant="tonal">
        <v-card-text class="d-flex align-center">
          <v-icon icon="mdi-check-circle" color="success" size="32" class="mr-3" />
          <div>
            <div class="text-h6">{{ stats.presentDays }}</div>
            <div class="text-caption">Present Days</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    
    <v-col cols="12" md="3">
      <v-card color="error" variant="tonal">
        <v-card-text class="d-flex align-center">
          <v-icon icon="mdi-close-circle" color="error" size="32" class="mr-3" />
          <div>
            <div class="text-h6">{{ stats.absentDays }}</div>
            <div class="text-caption">Absent Days</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    
    <v-col cols="12" md="3">
      <v-card color="info" variant="tonal">
        <v-card-text class="d-flex align-center">
          <v-icon icon="mdi-account-group" color="info" size="32" class="mr-3" />
          <div>
            <div class="text-h6">{{ stats.totalEmployees }}</div>
            <div class="text-caption">Total Employees</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    
    <v-col cols="12" md="3">
      <v-card color="warning" variant="tonal">
        <v-card-text class="d-flex align-center">
          <v-icon icon="mdi-calendar-multiple" color="warning" size="32" class="mr-3" />
          <div>
            <div class="text-h6">{{ stats.totalAbsences }}</div>
            <div class="text-caption">Total Absences</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Employee, Absence } from '../types/absence'

interface Props {
  employees: Employee[]
  absences: Absence[]
}

const props = defineProps<Props>()

const stats = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const yearEnd = new Date(currentYear, 11, 31)
  
  // Calculate total working days in the year
  let totalWorkingDays = 0
  let totalDays = 0
  
  for (let date = new Date(yearStart); date <= yearEnd; date.setDate(date.getDate() + 1)) {
    totalDays++
    const day = date.getDay()
    if (day !== 0 && day !== 6) { // Not weekend
      totalWorkingDays++
    }
  }
  
  // Calculate total possible attendance days
  const totalPossibleAttendance = props.employees.length * totalWorkingDays
  
  // Calculate actual attendance
  let totalAbsentDays = 0
  props.absences.forEach(absence => {
    const startDate = new Date(absence.startDate)
    const endDate = new Date(absence.endDate)
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const day = date.getDay()
      if (day !== 0 && day !== 6) { // Only count working days
        totalAbsentDays++
      }
    }
  })
  
  const totalPresentDays = totalPossibleAttendance - totalAbsentDays
  
  return {
    presentDays: totalPresentDays.toLocaleString(),
    absentDays: totalAbsentDays.toLocaleString(),
    totalEmployees: props.employees.length,
    totalAbsences: props.absences.length
  }
})
</script>
