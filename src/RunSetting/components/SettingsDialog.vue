<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseDialog from './common/BaseDialog.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useSettings } from '@/composables/useSettings'
import { useI18n } from '@/utils/i18n'
import AppearanceTab from './settings/AppearanceTab.vue'
import ExcludeTab from './settings/ExcludeTab.vue'
import ButtonsTab from './settings/ButtonsTab.vue'

type SettingsTab = 'appearance' | 'excludeFolders' | 'buttons'

const emit = defineEmits<{
  close: []
}>()

const { resetSettings, saveSettings } = useSettings()
const { t } = useI18n()

const activeTab = ref<SettingsTab>('appearance')

const tabs = computed(() => [
  { key: 'appearance' as const, label: t('ui.tabs.appearance'), icon: '🎨' },
  { key: 'excludeFolders' as const, label: t('ui.tabs.excludeFolders'), icon: '📁' },
  { key: 'buttons' as const, label: t('ui.tabs.buttons'), icon: '🔘' },
])

function handleSave() {
  saveSettings()
  emit('close')
}

function handleCancel() {
  emit('close')
}

function handleReset() {
  if (!window.confirm(t('ui.messages.confirmReset'))) {
    return
  }
  resetSettings()
  window.utools.showNotification(t('ui.notifications.reset'))
}
</script>

<template>
  <BaseDialog :title="t('ui.dialogTitles.settings')" @close="handleCancel">
    <template #header>
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
    </template>

    <template #default>
      <div class="tab-content">
        <AppearanceTab v-show="activeTab === 'appearance'" />
        <ExcludeTab v-show="activeTab === 'excludeFolders'" />
        <ButtonsTab v-show="activeTab === 'buttons'" />
      </div>
    </template>

    <template #footer>
      <IconButton :icon="UI_ICONS.reset" :tooltip="t('ui.tooltips.reset')" variant="default" @click="handleReset" />
      <IconButton :icon="UI_ICONS.cancel" :tooltip="t('ui.tooltips.cancel')" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="t('ui.tooltips.save')" variant="primary" @click="handleSave" />
    </template>
  </BaseDialog>
</template>

<style scoped>
.tab-nav {
  display: flex;
  gap: 4px;
  padding: 12px 20px 0;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--btn-primary, #58a4f6);
}

.tab-btn.active {
  color: var(--btn-primary, #58a4f6);
  border-bottom-color: var(--btn-primary, #58a4f6);
}

.tab-icon {
  font-size: 14px;
}

.tab-content {
  padding: 20px;
}

@media (prefers-color-scheme: dark) {
  .tab-nav {
    border-bottom-color: #444;
  }

  .tab-btn {
    color: #bbb;
  }
}
</style>
