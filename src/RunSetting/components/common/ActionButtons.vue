<script setup lang="ts">
import { computed } from 'vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'

const props = defineProps<{
  disabled?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showToggle?: boolean
  showCopy?: boolean
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>()

const emit = defineEmits<{
  edit: []
  delete: []
  toggle: []
  copy: []
}>()

const { t } = useI18n()

const toggleIcon = computed(() => {
  return props.disabled ? UI_ICONS.enable : UI_ICONS.disable
})

const toggleTooltip = computed(() => {
  return props.disabled ? t('ui.tooltips.enable') : t('ui.tooltips.disable')
})

const toggleVariant = computed(() => {
  return props.disabled ? 'success' : 'warning'
})
</script>

<template>
  <div class="action-buttons" @click.stop>
    <IconButton v-if="showCopy" :icon="UI_ICONS.copy" :tooltip="t('ui.tooltips.copy')" variant="default"
      :tooltip-position="tooltipPosition" @click="emit('copy')" />
    <IconButton v-if="showToggle" :icon="toggleIcon" :tooltip="toggleTooltip" :variant="toggleVariant"
      :tooltip-position="tooltipPosition" @click="emit('toggle')" />
    <IconButton v-if="showEdit" :icon="UI_ICONS.edit" :tooltip="t('ui.tooltips.edit')" variant="primary"
      :tooltip-position="tooltipPosition" @click="emit('edit')" />
    <IconButton v-if="showDelete" :icon="UI_ICONS.delete" :tooltip="t('ui.tooltips.delete')" variant="danger"
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
