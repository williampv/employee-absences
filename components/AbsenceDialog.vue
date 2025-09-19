<template>
  <v-dialog
    :model-value="dialogData.isOpen"
    @update:model-value="closeDialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ dialogData.mode === 'create' ? 'Add Absence' : 'Edit Absence' }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <!-- Employee Selection (only for create mode) -->
          <v-select
            v-if="dialogData.mode === 'create'"
            v-model="form.employeeId"
            :items="employeeOptions"
            item-title="text"
            item-value="value"
            label="Employee"
            :rules="[v => !!v || 'Employee is required']"
            required
            class="mb-4"
          />

          <!-- Absence Type -->
          <v-select
            v-model="form.type"
            :items="absenceTypeOptions"
            item-title="text"
            item-value="value"
            label="Absence Type"
            :rules="[v => !!v || 'Type is required']"
            required
            class="mb-4"
          />

          <!-- Date Range -->
          <div class="d-flex gap-4 mb-4">
            <v-text-field
              v-model="form.startDate"
              label="Start Date"
              type="date"
              :rules="[v => !!v || 'Start date is required']"
              required
              style="flex: 1"
            />
            <v-text-field
              v-model="form.endDate"
              label="End Date"
              type="date"
              :rules="[
                v => !!v || 'End date is required',
                v => !v || !form.startDate || v >= form.startDate || 'End date must be after start date'
              ]"
              required
              style="flex: 1"
            />
          </div>

          <!-- Duration Display -->
          <v-alert
            v-if="durationDays > 0"
            type="info"
            variant="tonal"
            class="mb-4"
          >
            Duration: {{ durationDays }} day{{ durationDays !== 1 ? 's' : '' }}
          </v-alert>

          <!-- Reason -->
          <v-textarea
            v-model="form.reason"
            label="Reason (Optional)"
            placeholder="Enter reason for absence..."
            rows="3"
            auto-grow
            class="mb-4"
          />

          <!-- Conflict Warning -->
          <v-alert
            v-if="hasConflict"
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            <template #title>Conflict Detected</template>
            There is already an absence recorded for this employee during the selected period.
            This will replace the existing absence.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="dialogData.mode === 'edit'"
          color="error"
          variant="text"
          @click="handleDelete"
        >
          Delete
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          @click="handleSave"
        >
          {{ dialogData.mode === 'create' ? 'Add Absence' : 'Update Absence' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Absence, AbsenceDialogData, Employee } from '../types/absence'

interface Props {
  dialogData: AbsenceDialogData
  employees: Employee[]
  existingAbsences: Absence[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [data: any]
  delete: [id: string]
  close: []
}>()

// Form state
const formRef = ref()
const isFormValid = ref(false)

const form = reactive({
  employeeId: '',
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

// Employee options for dropdown
const employeeOptions = computed(() => {
  return props.employees.map(employee => ({
    text: `${employee.firstName} ${employee.lastName} (${employee.personnelNumber})`,
    value: employee.id
  }))
})

// Absence type options
const absenceTypeOptions = [
  { text: 'Sick Leave', value: 'sick' },
  { text: 'Vacation', value: 'vacation' },
  { text: 'Personal Leave', value: 'personal' },
  { text: 'Other', value: 'other' }
]

// Calculate duration in days
const durationDays = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
})

// Check for conflicts with existing absences
const hasConflict = computed(() => {
  if (!form.employeeId || !form.startDate || !form.endDate) return false
  
  const currentAbsenceId = props.dialogData.absence?.id
  
  return props.existingAbsences.some(absence => {
    if (absence.id === currentAbsenceId) return false // Don't conflict with self
    
    return absence.employeeId === form.employeeId &&
           ((form.startDate >= absence.startDate && form.startDate <= absence.endDate) ||
            (form.endDate >= absence.startDate && form.endDate <= absence.endDate) ||
            (form.startDate <= absence.startDate && form.endDate >= absence.endDate))
  })
})

// Initialize form when dialog opens
watch(() => props.dialogData.isOpen, (isOpen) => {
  if (isOpen) {
    initializeForm()
  }
})

const initializeForm = () => {
  if (props.dialogData.mode === 'edit' && props.dialogData.absence) {
    const absence = props.dialogData.absence
    form.employeeId = absence.employeeId
    form.type = absence.type
    form.startDate = absence.startDate
    form.endDate = absence.endDate
    form.reason = absence.reason || ''
  } else if (props.dialogData.mode === 'create') {
    form.employeeId = props.dialogData.employeeId || ''
    form.type = ''
    form.startDate = props.dialogData.date || ''
    form.endDate = props.dialogData.date || ''
    form.reason = ''
  }
}

// Handle save
const handleSave = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  const absenceData = {
    employeeId: form.employeeId,
    type: form.type,
    startDate: form.startDate,
    endDate: form.endDate,
    reason: form.reason.trim() || undefined
  }
  
  if (props.dialogData.mode === 'edit' && props.dialogData.absence) {
    emit('save', {
      id: props.dialogData.absence.id,
      ...absenceData
    })
  } else {
    emit('save', absenceData)
  }
  
  closeDialog()
}

// Handle delete
const handleDelete = () => {
  if (props.dialogData.absence) {
    emit('delete', props.dialogData.absence.id)
    closeDialog()
  }
}

// Close dialog
const closeDialog = () => {
  emit('close')
}
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

@media (max-width: 600px) {
  .d-flex.gap-4 {
    flex-direction: column;
    gap: 16px;
  }
  
  .d-flex.gap-4 > * {
    flex: none;
  }
}
</style>
