<template>
  <v-app>
    <v-app-bar
      color="primary"
      theme="dark"
      elevation="2"
    >
      <v-app-bar-title>
        <v-icon icon="mdi-calendar-account" class="mr-2" />
        Employee Absences Manager
      </v-app-bar-title>
      
      <v-spacer />
      
      <v-btn
        icon="mdi-refresh"
        variant="text"
        @click="refreshData"
        title="Refresh Data"
      />
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4">
        <!-- Statistics Dashboard -->
        <AbsenceStats
          :employees="employees"
          :absences="absences"
        />
        
        <v-row>
          <v-col cols="12">
            <VirtualScrollCalendar
              :employees="employees"
              :get-absence-for-date="getAbsenceForDate"
              @cell-click="handleCellClick"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Absence Management Dialog -->
    <AbsenceDialog
      :dialog-data="dialogData"
      :employees="employees"
      :existing-absences="absences"
      @save="handleSaveAbsence"
      @delete="handleDeleteAbsence"
      @close="closeDialog"
    />

    <!-- Loading Overlay -->
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>

    <!-- Notification Container -->
    <NotificationContainer
      :notifications="notifications"
      @remove="removeNotification"
    />
  </v-app>
</template>

<script setup lang="ts">
import { useAbsences } from '../composables/useAbsences'
import { useNotifications } from '../composables/useNotifications'
import AbsenceStats from '../components/AbsenceStats.vue'
import VirtualScrollCalendar from '../components/VirtualScrollCalendar.vue'
import AbsenceDialog from '../components/AbsenceDialog.vue'
import NotificationContainer from '../components/NotificationContainer.vue'

// Use the absences composable
const {
  employees,
  absences,
  dialogData,
  getAbsenceForDate,
  addAbsence,
  updateAbsence,
  deleteAbsence,
  openDialog,
  closeDialog
} = useAbsences()

// Use notifications
const {
  notifications,
  removeNotification,
  success,
  error,
  warning,
  info
} = useNotifications()

// Loading state
const isLoading = ref(false)

// Handle cell click to open dialog
const handleCellClick = (employeeId: string, date: string) => {
  const existingAbsence = getAbsenceForDate(employeeId, date)
  
  if (existingAbsence) {
    // Edit existing absence
    openDialog('edit', employeeId, date, existingAbsence)
  } else {
    // Create new absence
    openDialog('create', employeeId, date)
  }
}

// Handle saving absence
const handleSaveAbsence = async (absenceData: any) => {
  isLoading.value = true
  
  try {
    if (absenceData.id) {
      // Update existing absence
      updateAbsence(absenceData.id, absenceData)
      success('Absence Updated', 'The absence has been successfully updated.')
    } else {
      // Create new absence
      addAbsence(absenceData)
      success('Absence Created', 'A new absence has been successfully created.')
    }
  } catch (err) {
    console.error('Error saving absence:', err)
    error('Save Failed', 'There was an error saving the absence. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Handle deleting absence
const handleDeleteAbsence = async (absenceId: string) => {
  isLoading.value = true
  
  try {
    deleteAbsence(absenceId)
    success('Absence Deleted', 'The absence has been successfully removed.')
  } catch (err) {
    console.error('Error deleting absence:', err)
    error('Delete Failed', 'There was an error deleting the absence. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Refresh data (placeholder for future backend integration)
const refreshData = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    info('Data Refreshed', 'The data has been successfully refreshed.')
  }, 1000)
}
</script>

<style>
/* Global styles for better UX */
.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-main {
  background-color: rgb(var(--v-theme-background));
}

/* Smooth transitions for better UX */
.v-card {
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .v-container {
    padding: 16px 8px;
  }
}

@media (max-width: 600px) {
  .v-container {
    padding: 8px 4px;
  }
  
  .v-app-bar-title {
    font-size: 1.1rem;
  }
}
</style>
