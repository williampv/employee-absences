<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div">
      <v-alert
        v-for="notification in notifications"
        :key="notification.id"
        :type="notification.type"
        variant="tonal"
        class="mb-2 notification-item"
        closable
        @click:close="removeNotification(notification.id)"
      >
        <div class="d-flex align-start">
          <v-icon
            :icon="getNotificationIcon(notification.type)"
            class="mr-2 mt-1"
          />
          <div>
            <div class="font-weight-medium">{{ notification.title }}</div>
            <div v-if="notification.message" class="text-caption mt-1">
              {{ notification.message }}
            </div>
          </div>
        </div>
      </v-alert>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '../composables/useNotifications'

interface Props {
  notifications: Notification[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const removeNotification = (id: string) => {
  emit('remove', id)
}

const getNotificationIcon = (type: Notification['type']) => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[type]
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
  pointer-events: none;
}

.notification-item {
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 600px) {
  .notification-container {
    top: 70px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
