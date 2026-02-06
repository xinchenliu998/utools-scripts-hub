<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import draggable from 'vuedraggable'
import { useScripts, type RuleItem } from '@/composables/useScripts'
import RuleItemComponent from '@/RunSetting/components/RuleItem.vue'
import AddRuleDialog from '@/RunSetting/components/AddRuleDialog.vue'
import SearchInput from '@/RunSetting/components/common/SearchInput.vue'
import EmptyState from '@/RunSetting/components/common/EmptyState.vue'
import HelpTooltip from '@/RunSetting/components/common/HelpTooltip.vue'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'

const { rules, loadConfig, removeRule, toggleRuleDisabled, searchRules, updateRulesOrder } = useScripts()
const showAddDialog = ref(false)
const editingRule = ref<RuleItem | null>(null)
const searchKeyword = ref('')
const { t } = useI18n()

const filteredRules = computed(() => {
  if (!searchKeyword.value.trim()) {
    return rules.value
  }
  return searchRules(searchKeyword.value.trim())
})

// 用于拖拽的本地列表（只在非搜索状态下使用）
const draggableRules = computed({
  get: () => filteredRules.value,
  set: (newOrder: RuleItem[]) => {
    // 只有在非搜索状态下才允许拖拽排序
    if (!searchKeyword.value.trim()) {
      updateRulesOrder(newOrder)
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
  editingRule.value = null
  showAddDialog.value = true
}

function handleEdit(rule: RuleItem) {
  editingRule.value = rule
  showAddDialog.value = true
}

function handleDelete(id: string) {
  if (window.confirm(t('ui.messages.confirmDeleteRule'))) {
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

function handleDragEnd() {
  // 拖拽结束后的处理（如果需要可以添加提示）
}
</script>

<template>
  <div class="rule-list-container">
    <div class="header">
      <div class="search-container">
        <SearchInput v-model="searchKeyword" :placeholder="t('ui.placeholders.searchRule')" />
      </div>
      <div class="header-actions">
        <IconButton :icon="UI_ICONS.add" :tooltip="t('ui.tooltips.addRule')" variant="primary" tooltip-position="left"
          @click="handleAdd" />
        <HelpTooltip>
          {{ t('ui.hints.ruleHelp') }}
        </HelpTooltip>
      </div>
    </div>

    <div class="rules-container">
      <EmptyState v-if="rules.length === 0" :message="t('ui.messages.emptyRules')" :hint="t('ui.messages.emptyRulesHint')" />
      <EmptyState v-else-if="filteredRules.length === 0" :message="t('ui.messages.noMatchRules')"
        :hint="t('ui.messages.searchHint')" />
      <draggable v-else v-model="draggableRules" :disabled="!!searchKeyword.trim()" item-key="id" handle=".rule-header"
        class="rules-list" @end="handleDragEnd">
        <template #item="{ element: rule, index }">
          <RuleItemComponent :rule="rule" :index="index" :total="filteredRules.length" @edit="handleEdit"
            @delete="handleDelete" @toggleDisabled="handleToggleDisabled" />
        </template>
      </draggable>
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

.rules-list .rule-item {
  cursor: move;
}

.rules-list .rule-item:active {
  cursor: grabbing;
}
</style>
