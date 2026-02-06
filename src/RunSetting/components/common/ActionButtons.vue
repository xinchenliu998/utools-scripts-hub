<script setup lang="ts">
import { computed } from 'vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { zhCN, enUS } from '@/locales'
import { useSettings } from '@/composables/useSettings'

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

const { settings } = useSettings()

// 获取当前语言的翻译
function t() {
  return settings.value.locale === 'en-US' ? enUS : zhCN
}

const toggleIcon = computed(() => {
  return props.disabled ? UI_ICONS.enable : UI_ICONS.disable
})

const toggleTooltip = computed(() => {
  return props.disabled ? t().UI_TOOLTIPS.enable : t().UI_TOOLTIPS.disable
})

const toggleVariant = computed(() => {
  return props.disabled ? 'success' : 'warning'
})
</script>

<template>
  <div class="action-buttons" @click.stop>
    <IconButton v-if="showToggle" :icon="toggleIcon" :tooltip="toggleTooltip" :variant="toggleVariant"
      :tooltip-position="tooltipPosition" @click="emit('toggle')" />
    <IconButton v-if="showEdit" :icon="UI_ICONS.edit" :tooltip="t().UI_TOOLTIPS.edit" variant="primary"
      :tooltip-position="tooltipPosition" @click="emit('edit')" />
    <IconButton v-if="showDelete" :icon="UI_ICONS.delete" :tooltip="t().UI_TOOLTIPS.delete" variant="danger"
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
