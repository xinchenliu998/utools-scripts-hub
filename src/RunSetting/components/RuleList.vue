<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useScripts, type RuleItem } from '../../composables/useScripts'
import RuleItemComponent from './RuleItem.vue'
import AddRuleDialog from './AddRuleDialog.vue'

const { rules, loadConfig, removeRule, toggleRuleDisabled, searchRules } = useScripts()
const showAddDialog = ref(false)
const editingRule = ref<RuleItem | null>(null)
const searchKeyword = ref('')

const filteredRules = computed(() => {
  if (!searchKeyword.value.trim()) {
    return rules.value
  }
  return searchRules(searchKeyword.value.trim())
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

function handleToggleDisabled(id: string) {
  toggleRuleDisabled(id)
}

function handleDialogClose() {
  showAddDialog.value = false
  editingRule.value = null
}
</script>

<template>
  <div class="rule-list-container">
    <div class="header">
      <div class="search-container">
        <input v-model="searchKeyword" type="text" placeholder="搜索规则（名称、模式、应用、描述）" class="search-input" />
      </div>
      <div class="header-actions">
        <button @click="handleAdd" class="add-btn">+ 添加规则</button>
        <div class="help-tooltip">
          <button class="help-btn" aria-label="帮助">?</button>
          <div class="tooltip-content">
            规则用于根据文件后缀或文件名匹配模式，自动指定应用来运行脚本。
            例如：匹配 <code>\.js$</code> 的文件使用 <code>node</code> 运行。
          </div>
        </div>
      </div>
    </div>

    <div class="rules-container">
      <div v-if="rules.length === 0" class="empty-state">
        <p>还没有添加任何规则</p>
        <p class="hint">点击上方按钮添加规则</p>
      </div>

      <div v-else-if="filteredRules.length === 0" class="empty-state">
        <p>没有找到匹配的规则</p>
        <p class="hint">尝试使用其他关键词搜索</p>
      </div>

      <div v-else class="rules-list">
        <RuleItemComponent v-for="rule in filteredRules" :key="rule.id" :rule="rule" @edit="handleEdit"
          @delete="handleDelete" @toggleDisabled="handleToggleDisabled" />
      </div>
    </div>

    <AddRuleDialog v-if="showAddDialog" :rule="editingRule" @close="handleDialogClose" />
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

.tooltip-content code {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.help-tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
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
