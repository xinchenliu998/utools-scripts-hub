<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type ScriptItem } from '../../composables/useScripts'
import ScriptItemComponent from './ScriptItem.vue'
import AddScriptDialog from './AddScriptDialog.vue'

const { scripts, loadConfig, removeScript } = useScripts()
const showAddDialog = ref(false)
const editingScript = ref<ScriptItem | null>(null)

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

function handleDialogClose() {
  showAddDialog.value = false
  editingScript.value = null
}
</script>

<template>
  <div class="script-list-container">
    <div class="header">
      <h2>脚本列表</h2>
      <button @click="handleAdd" class="add-btn">+ 添加脚本/文件夹</button>
    </div>

    <div class="scripts-container">
      <div v-if="scripts.length === 0" class="empty-state">
        <p>还没有添加任何脚本</p>
        <p class="hint">点击上方按钮添加脚本或文件夹</p>
      </div>

      <div v-else class="scripts-list">
        <ScriptItemComponent
          v-for="script in scripts"
          :key="script.id"
          :script="script"
          @edit="handleEdit"
          @delete="handleDelete"
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
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
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
  .header h2 {
    color: #fff;
  }
}
</style>
