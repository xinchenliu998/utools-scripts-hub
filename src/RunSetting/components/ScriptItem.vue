<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ScriptItem } from '@/composables/useScripts'
import ActionButtons from '@/RunSetting/components/common/ActionButtons.vue'
import { UI_ICONS } from '@/constants/ui'
import { zhCN, enUS } from '@/locales'
import { useSettings } from '@/composables/useSettings'

const props = defineProps<{
  script: ScriptItem
  index?: number
  total?: number
}>()

const emit = defineEmits<{
  edit: [script: ScriptItem]
  delete: [id: string]
  toggleDisabled: [id: string]
}>()

const { settings } = useSettings()

// 获取当前语言的翻译
function t() {
  return settings.value.locale === 'en-US' ? enUS : zhCN
}

const showDetails = ref(false)

const displayPath = computed(() => {
  return props.script.path
})

const tooltipPosition = computed(() => {
  const index = props.index ?? 0
  const total = props.total ?? 1
  // 第一项（索引0）在下面显示，最后一项在上面显示
  if (index === 0) {
    return 'bottom'
  } else if (index === total - 1) {
    return 'top'
  }
  return 'bottom'
})

function handleEdit() {
  emit('edit', props.script)
}

function handleDelete() {
  emit('delete', props.script.id)
}

function handleToggle() {
  emit('toggleDisabled', props.script.id)
}
</script>

<template>
  <div class="script-item" :class="{ disabled: script.disabled }">
    <div class="script-header" @click="showDetails = !showDetails">
      <div class="script-info">
        <div class="script-name">
          <span class="icon">{{ script.isDirectory ? UI_ICONS.folder : UI_ICONS.file }}</span>
          {{ script.name }}
          <span v-if="script.disabled" class="disabled-badge">{{ t().STATUS_LABELS.disabled }}</span>
        </div>
        <div class="script-path">{{ displayPath }}</div>
      </div>
      <ActionButtons :disabled="script.disabled" :show-edit="true" :show-delete="true" :show-toggle="true"
        :tooltip-position="tooltipPosition" @edit="handleEdit" @delete="handleDelete" @toggle="handleToggle" />
    </div>

    <div v-if="showDetails" class="script-details">
      <div class="detail-item" v-if="script.description">
        <label>{{ t().FORM_LABELS.scriptDescriptionLabel }}</label>
        <span>{{ script.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.script-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.2s;
}

.script-item:hover {
  border-color: var(--blue, rgb(88, 164, 246));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.script-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
}

.script-info {
  flex: 1;
  min-width: 0;
}

.script-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.disabled-badge {
  font-size: 11px;
  padding: 2px 6px;
  background-color: #ff9800;
  color: white;
  border-radius: 3px;
  font-weight: normal;
}

.script-name .icon {
  font-size: 16px;
}

.script-path {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.script-item.disabled {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.script-details {
  padding: 12px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.detail-item {
  margin-bottom: 8px;
  font-size: 13px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  font-weight: 600;
  color: #666;
  margin-right: 8px;
}

.detail-item span {
  color: #333;
}

@media (prefers-color-scheme: dark) {
  .script-item {
    background-color: #424242;
    border-color: #666;
  }

  .script-item:hover {
    border-color: var(--blue, rgb(88, 164, 246));
  }

  .script-name {
    color: #fff;
  }

  .disabled-badge {
    background-color: #ff9800;
  }

  .script-path {
    color: #bbb;
  }

  .script-item.disabled {
    background-color: #383838;
  }

  .script-details {
    background-color: #383838;
    border-top-color: #666;
  }

  .detail-item label {
    color: #bbb;
  }

  .detail-item span {
    color: #fff;
  }
}
</style>
