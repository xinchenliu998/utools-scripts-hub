<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type RuleItem } from '../../composables/useScripts'
import RuleItemComponent from './RuleItem.vue'
import AddRuleDialog from './AddRuleDialog.vue'

const { rules, loadConfig, removeRule } = useScripts()
const showAddDialog = ref(false)
const editingRule = ref<RuleItem | null>(null)

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
  editingRule.value = null
  showAddDialog.value = true
}

function handleEdit(rule: RuleItem) {
  editingRule.value = rule
  showAddDialog.value = true
}

function handleDelete(id: string) {
  if (window.confirm('确定要删除这个规则吗？')) {
    removeRule(id)
  }
}

function handleDialogClose() {
  showAddDialog.value = false
  editingRule.value = null
}
</script>

<template>
  <div class="rule-list-container">
    <div class="header">
      <h2>规则配置</h2>
      <button @click="handleAdd" class="add-btn">+ 添加规则</button>
    </div>

    <div class="rules-info">
      <p class="info-text">
        规则用于根据文件后缀或文件名匹配模式，自动指定应用来运行脚本。
        例如：匹配 <code>\.js$</code> 的文件使用 <code>node</code> 运行。
      </p>
    </div>

    <div class="rules-container">
      <div v-if="rules.length === 0" class="empty-state">
        <p>还没有添加任何规则</p>
        <p class="hint">点击上方按钮添加规则</p>
      </div>

      <div v-else class="rules-list">
        <RuleItemComponent
          v-for="rule in rules"
          :key="rule.id"
          :rule="rule"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>

    <AddRuleDialog
      v-if="showAddDialog"
      :rule="editingRule"
      @close="handleDialogClose"
    />
  </div>
</template>

<style scoped>
.rule-list-container {
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

.rules-info {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f0f7ff;
  border-radius: 6px;
  border: 1px solid #b3d9ff;
}

.info-text {
  margin: 0;
  font-size: 13px;
  color: #333;
  line-height: 1.6;
}

.info-text code {
  background-color: #e3f2fd;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.rules-container {
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

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (prefers-color-scheme: dark) {
  .header h2 {
    color: #fff;
  }

  .rules-info {
    background-color: #1e3a5f;
    border-color: #3d5a80;
  }

  .info-text {
    color: #fff;
  }

  .info-text code {
    background-color: #2d4a6b;
    color: #fff;
  }
}
</style>
