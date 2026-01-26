<script setup lang="ts">
import { computed } from 'vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'

const props = defineProps<{
  disabled?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showToggle?: boolean
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>()

const emit = defineEmits<{
  edit: []
  delete: []
  toggle: []
}>()

const toggleIcon = computed(() => {
  return props.disabled ? UI_ICONS.enable : UI_ICONS.disable
})

const toggleTooltip = computed(() => {
  return props.disabled ? UI_TOOLTIPS.enable : UI_TOOLTIPS.disable
})

const toggleVariant = computed(() => {
  return props.disabled ? 'success' : 'warning'
})
</script>

<template>
  <div class="action-buttons" @click.stop>
    <IconButton v-if="showToggle" :icon="toggleIcon" :tooltip="toggleTooltip" :variant="toggleVariant"
      :tooltip-position="tooltipPosition" @click="emit('toggle')" />
    <IconButton v-if="showEdit" :icon="UI_ICONS.edit" :tooltip="UI_TOOLTIPS.edit" variant="primary"
      :tooltip-position="tooltipPosition" @click="emit('edit')" />
    <IconButton v-if="showDelete" :icon="UI_ICONS.delete" :tooltip="UI_TOOLTIPS.delete" variant="danger"
      :tooltip-position="tooltipPosition" @click="emit('delete')" />
  </div>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}
</style>
