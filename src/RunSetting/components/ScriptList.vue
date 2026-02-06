<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import draggable from 'vuedraggable'
import { useScripts, type ScriptItem } from '@/composables/useScripts'
import ScriptItemComponent from '@/RunSetting/components/ScriptItem.vue'
import AddScriptDialog from '@/RunSetting/components/AddScriptDialog.vue'
import SearchInput from '@/RunSetting/components/common/SearchInput.vue'
import EmptyState from '@/RunSetting/components/common/EmptyState.vue'
import HelpTooltip from '@/RunSetting/components/common/HelpTooltip.vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'

const { scripts, loadConfig, removeScript, toggleScriptDisabled, updateScriptsOrder } = useScripts()
const showAddDialog = ref(false)
const editingScript = ref<ScriptItem | null>(null)
const searchKeyword = ref('')
const { t } = useI18n()

const filteredScripts = computed(() => {
  if (!searchKeyword.value.trim()) {
    return scripts.value
  }
  const lowerKeyword = searchKeyword.value.trim().toLowerCase()
  return scripts.value.filter(script => {
    const nameMatch = script.name.toLowerCase().includes(lowerKeyword)
    const pathMatch = script.path.toLowerCase().includes(lowerKeyword)
    const descMatch = script.description?.toLowerCase().includes(lowerKeyword)
    const keywordsMatch = script.keywords?.some(k => k.toLowerCase().includes(lowerKeyword))
    return nameMatch || pathMatch || descMatch || keywordsMatch
  })
})

// 用于拖拽的本地列表（只在非搜索状态下使用）
const draggableScripts = computed({
  get: () => filteredScripts.value,
  set: (newOrder: ScriptItem[]) => {
    // 只有在非搜索状态下才允许拖拽排序
    if (!searchKeyword.value.trim()) {
      updateScriptsOrder(newOrder)
    }
  }
})

onMounted(() => {
  if (window.services) {
    loadConfig()
  } else {
    setTimeout(() => {
      if (window.services) {
        loadConfig()
      }
    }, 200)
  }
})

function handleAdd() {
  editingScript.value = null
  showAddDialog.value = true
}

function handleEdit(script: ScriptItem) {
  editingScript.value = script
  showAddDialog.value = true
}

function handleDelete(id: string) {
  if (window.confirm(t.UI_MESSAGES.confirmDeleteScript)) {
    removeScript(id)
  }
}

function handleToggleDisabled(id: string) {
  toggleScriptDisabled(id)
}

function handleDialogClose() {
  showAddDialog.value = false
  editingScript.value = null
}

function handleDragEnd() {
  // 拖拽结束后的处理（如果需要可以添加提示）
}
</script>

<template>
  <div class="script-list-container">
    <div class="header">
      <div class="search-container">
        <SearchInput v-model="searchKeyword" :placeholder="t.PLACEHOLDERS.searchScript" />
      </div>
      <div class="header-actions">
        <IconButton :icon="UI_ICONS.add" :tooltip="t.UI_TOOLTIPS.addScript" variant="primary" tooltip-position="left"
          @click="handleAdd" />
        <HelpTooltip>
          {{ t.HINTS.scriptHelp }}
        </HelpTooltip>
      </div>
    </div>

    <div class="scripts-container">
      <EmptyState v-if="scripts.length === 0" :message="t.UI_MESSAGES.emptyScripts"
        :hint="t.UI_MESSAGES.emptyScriptsHint" />
      <EmptyState v-else-if="filteredScripts.length === 0" :message="t.UI_MESSAGES.noMatchScripts"
        :hint="t.UI_MESSAGES.searchHint" />
      <draggable v-else v-model="draggableScripts" :disabled="!!searchKeyword.trim()" item-key="id"
        handle=".script-header" class="scripts-list" @end="handleDragEnd">
        <template #item="{ element: script, index }">
          <ScriptItemComponent :script="script" :index="index" :total="filteredScripts.length" @edit="handleEdit"
            @delete="handleDelete" @toggleDisabled="handleToggleDisabled" />
        </template>
      </draggable>
    </div>

    <AddScriptDialog v-if="showAddDialog" :script="editingScript" @close="handleDialogClose" />
  </div>
</template>

<style scoped>
.script-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  overflow: hidden;
}

.search-container {
  flex: 1;
  min-width: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.scripts-container {
  flex: 1;
  overflow-y: auto;
}

.scripts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scripts-list .script-item {
  cursor: move;
}

.scripts-list .script-item:active {
  cursor: grabbing;
}
</style>
