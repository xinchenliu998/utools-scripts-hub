<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useScripts, type ScriptItem } from '../../composables/useScripts'
import ScriptItemComponent from './ScriptItem.vue'
import AddScriptDialog from './AddScriptDialog.vue'

const { scripts, loadConfig, removeScript, toggleScriptDisabled } = useScripts()
const showAddDialog = ref(false)
const editingScript = ref<ScriptItem | null>(null)
const searchKeyword = ref('')

const filteredScripts = computed(() => {
  if (!searchKeyword.value.trim()) {
    return scripts.value
  }
  // 在配置的脚本列表中搜索
  const lowerKeyword = searchKeyword.value.trim().toLowerCase()
  return scripts.value.filter(script => {
    const nameMatch = script.name.toLowerCase().includes(lowerKeyword)
    const pathMatch = script.path.toLowerCase().includes(lowerKeyword)
    const descMatch = script.description?.toLowerCase().includes(lowerKeyword)
    const keywordsMatch = script.keywords?.some(k => k.toLowerCase().includes(lowerKeyword))
    
    return nameMatch || pathMatch || descMatch || keywordsMatch
  })
})

onMounted(() => {
  // 确保 services 已准备好
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
  if (window.confirm('确定要删除这个脚本吗？')) {
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
</script>

<template>
  <div class="script-list-container">
    <div class="header">
      <div class="search-container">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索脚本（名称、路径、描述、关键词）"
          class="search-input"
        />
      </div>
      <div class="header-actions">
        <button @click="handleAdd" class="add-btn">+ 添加脚本/文件夹</button>
        <div class="help-tooltip">
          <button class="help-btn" aria-label="帮助">?</button>
          <div class="tooltip-content">
            添加脚本文件或文件夹到脚本列表，支持通过关键词搜索快速运行。
            可以添加单个脚本文件，也可以添加整个文件夹（会自动扫描文件夹中的所有脚本）。
            已禁用的脚本不会在运行界面显示。
          </div>
        </div>
      </div>
    </div>

    <div class="scripts-container">
      <div v-if="scripts.length === 0" class="empty-state">
        <p>还没有添加任何脚本</p>
        <p class="hint">点击上方按钮添加脚本或文件夹</p>
      </div>

      <div v-else-if="filteredScripts.length === 0" class="empty-state">
        <p>没有找到匹配的脚本</p>
        <p class="hint">尝试使用其他关键词搜索</p>
      </div>

      <div v-else class="scripts-list">
        <ScriptItemComponent
          v-for="script in filteredScripts"
          :key="script.id"
          :script="script"
          @edit="handleEdit"
          @delete="handleDelete"
          @toggleDisabled="handleToggleDisabled"
        />
      </div>
    </div>

    <AddScriptDialog
      v-if="showAddDialog"
      :script="editingScript"
      @close="handleDialogClose"
    />
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

.add-btn {
  padding: 8px 16px;
  background-color: var(--blue, rgb(88, 164, 246));
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.add-btn:hover {
  opacity: 0.8;
}

.help-tooltip {
  position: relative;
  display: inline-block;
}

.help-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  background-color: #999;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  line-height: 1;
}

.help-btn:hover {
  background-color: var(--blue, rgb(88, 164, 246));
}

.tooltip-content {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: #333;
  color: #fff;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  white-space: normal;
  width: 280px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
}

.help-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--blue, rgb(88, 164, 246));
}

.scripts-container {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 8px;
}

.scripts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (prefers-color-scheme: dark) {
  .help-btn {
    background-color: #666;
  }

  .help-btn:hover {
    background-color: var(--blue, rgb(88, 164, 246));
  }

  .tooltip-content {
    background-color: #2d2d2d;
    border: 1px solid #555;
  }

  .search-input {
    background-color: #383838;
    border-color: #666;
    color: #fff;
  }

  .search-input:focus {
    border-color: var(--blue, rgb(88, 164, 246));
  }

  .search-input::placeholder {
    color: #999;
  }
}
</style>
