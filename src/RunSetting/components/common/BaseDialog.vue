<script setup lang="ts">
import IconButton from './IconButton.vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'

const props = defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <!-- 自定义 header slot -->
        <slot name="header">
          <h3>{{ title }}</h3>
        </slot>
        <IconButton :icon="UI_ICONS.close" :tooltip="UI_TOOLTIPS.close" variant="default" @click="handleClose" />
      </div>

      <div class="dialog-body">
        <slot />
      </div>

      <div class="dialog-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  gap: 12px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.dialog-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

@media (prefers-color-scheme: dark) {
  .dialog-content {
    background-color: #424242;
  }

  .dialog-header {
    border-bottom-color: #555;
  }

  .dialog-header h3 {
    color: #fff;
  }

  .dialog-footer {
    border-top-color: #555;
  }
}
</style>
