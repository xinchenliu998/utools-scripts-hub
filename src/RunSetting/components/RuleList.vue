<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useScripts, type RuleItem } from '@/composables/useScripts'
import RuleItemComponent from '@/RunSetting/components/RuleItem.vue'
import AddRuleDialog from '@/RunSetting/components/AddRuleDialog.vue'
import SearchInput from '@/RunSetting/components/common/SearchInput.vue'
import EmptyState from '@/RunSetting/components/common/EmptyState.vue'
import HelpTooltip from '@/RunSetting/components/common/HelpTooltip.vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS, UI_TOOLTIPS, UI_MESSAGES } from '@/constants/ui'

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
  if (window.confirm(UI_MESSAGES.confirmDeleteRule)) {
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
        <SearchInput v-model="searchKeyword" placeholder="搜索规则（名称、模式、应用、描述）" />
      </div>
      <div class="header-actions">
        <IconButton :icon="UI_ICONS.add" :tooltip="UI_TOOLTIPS.addRule" variant="primary" tooltip-position="left"
          @click="handleAdd" />
        <HelpTooltip>
          规则用于根据文件后缀或文件名匹配模式，自动指定应用来运行脚本。
          例如：匹配 <code>\.js$</code> 的文件使用 <code>node</code> 运行。
        </HelpTooltip>
      </div>
    </div>

    <div class="rules-container">
      <EmptyState v-if="rules.length === 0" :message="UI_MESSAGES.emptyRules" :hint="UI_MESSAGES.emptyRulesHint" />
      <EmptyState v-else-if="filteredRules.length === 0" :message="UI_MESSAGES.noMatchRules"
        :hint="UI_MESSAGES.searchHint" />
      <div v-else class="rules-list">
        <RuleItemComponent v-for="(rule, index) in filteredRules" :key="rule.id" :rule="rule" :index="index"
          :total="filteredRules.length" @edit="handleEdit" @delete="handleDelete" @toggleDisabled="handleToggleDisabled" />
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

.rules-container {
  flex: 1;
  overflow-y: auto;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
