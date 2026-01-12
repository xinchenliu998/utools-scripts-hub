<script setup lang="ts">
import { ref } from 'vue'
import ScriptList from './components/ScriptList.vue'
import RuleList from './components/RuleList.vue'

defineProps<{
  enterAction?: any
}>()

const activeTab = ref<'scripts' | 'rules'>('scripts')
</script>

<template>
  <div class="run-setting-container">
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'scripts' }]"
        @click="activeTab = 'scripts'"
      >
        脚本管理
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'rules' }]"
        @click="activeTab = 'rules'"
      >
        规则配置
      </button>
    </div>

    <div class="tab-content">
      <ScriptList v-if="activeTab === 'scripts'" />
      <RuleList v-if="activeTab === 'rules'" />
    </div>
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
