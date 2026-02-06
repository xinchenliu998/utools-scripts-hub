<script setup lang="ts">
import { ref } from 'vue'
import ScriptList from '@/RunSetting/components/ScriptList.vue'
import RuleList from '@/RunSetting/components/RuleList.vue'
import SettingsDialog from '@/RunSetting/components/SettingsDialog.vue'
import { useI18n } from '@/utils/i18n'

import type { EnterAction } from '@/types/global'

defineProps<{
  enterAction?: EnterAction
}>()

const activeTab = ref<'scripts' | 'rules'>('scripts')
const showSettings = ref(false)
const { t } = useI18n()
</script>

<template>
  <div class="run-setting-container">
    <div class="header">
      <div class="tabs">
        <button :class="['tab-btn', { active: activeTab === 'scripts' }]" @click="activeTab = 'scripts'">
          {{ t.TABS.scripts }}
        </button>
        <button :class="['tab-btn', { active: activeTab === 'rules' }]" @click="activeTab = 'rules'">
          {{ t.TABS.rules }}
        </button>
      </div>
      <button class="settings-btn" @click="showSettings = true" :title="t.DIALOG_TITLES.settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>

    <div class="tab-content">
      <ScriptList v-if="activeTab === 'scripts'" />
      <RuleList v-if="activeTab === 'rules'" />
    </div>

    <SettingsDialog v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<style scoped>
.run-setting-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--blue, rgb(88, 164, 246));
}

.tab-btn.active {
  color: var(--blue, rgb(88, 164, 246));
  border-bottom-color: var(--blue, rgb(88, 164, 246));
}

.settings-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background-color: #f0f0f0;
  color: var(--blue, rgb(88, 164, 246));
}

@media (prefers-color-scheme: dark) {
  .settings-btn {
    color: #bbb;
  }

  .settings-btn:hover {
    background-color: #383838;
    color: var(--blue, rgb(88, 164, 246));
  }
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

@media (prefers-color-scheme: dark) {
  .tabs {
    border-bottom-color: #666;
  }

  .tab-btn {
    color: #bbb;
  }

  .tab-btn:hover {
    color: var(--blue, rgb(88, 164, 246));
  }
}
</style>
