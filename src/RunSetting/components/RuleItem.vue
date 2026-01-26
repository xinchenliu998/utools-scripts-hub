<script setup lang="ts">
import { ref } from 'vue'
import type { RuleItem } from '../../composables/useScripts'

const props = defineProps<{
  rule: RuleItem
}>()

const emit = defineEmits<{
  edit: [rule: RuleItem]
  delete: [id: string]
  toggleDisabled: [id: string]
}>()

const showDetails = ref(false)

function handleEdit() {
  emit('edit', props.rule)
}

function handleDelete() {
  emit('delete', props.rule.id)
}

function handleToggleDisabled() {
  emit('toggleDisabled', props.rule.id)
}
</script>

<template>
  <div class="rule-item" :class="{ disabled: rule.disabled }">
    <div class="rule-header" @click="showDetails = !showDetails">
      <div class="rule-info">
        <div class="rule-name">
          {{ rule.name }}
          <span v-if="rule.disabled" class="disabled-badge">已禁用</span>
        </div>
        <div class="rule-pattern">
          <span class="label">匹配模式：</span>
          <code>{{ rule.pattern }}</code>
        </div>
      </div>
      <div class="rule-actions">
        <button @click.stop="handleToggleDisabled" class="action-btn" :class="rule.disabled ? 'enable-btn' : 'disable-btn'">
          {{ rule.disabled ? '启用' : '禁用' }}
        </button>
        <button @click.stop="handleEdit" class="action-btn">编辑</button>
        <button @click.stop="handleDelete" class="action-btn delete-btn">删除</button>
      </div>
    </div>

    <div v-if="showDetails" class="rule-details">
      <div class="detail-item" v-if="rule.app">
        <label>指定应用：</label>
        <code>{{ rule.app }}</code>
      </div>
      <div class="detail-item" v-if="rule.args && rule.args.length > 0">
        <label>参数：</label>
        <code>{{ rule.args.join(' ') }}</code>
      </div>
      <div class="detail-item" v-if="rule.description">
        <label>描述：</label>
        <span>{{ rule.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rule-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.2s;
}

.rule-item:hover {
  border-color: var(--blue, rgb(88, 164, 246));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
}

.rule-info {
  flex: 1;
  min-width: 0;
}

.rule-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.disabled-badge {
  font-size: 11px;
  padding: 2px 6px;
  background-color: #ff9800;
  color: white;
  border-radius: 3px;
  font-weight: normal;
}

.rule-pattern {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

.rule-pattern .label {
  color: #999;
}

.rule-pattern code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #d32f2f;
}

.rule-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.action-btn {
  padding: 6px 12px;
  background-color: var(--blue, rgb(88, 164, 246));
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 0.8;
}

.action-btn.disable-btn {
  background-color: #ff9800;
  color: white;
  border: none;
}

.action-btn.disable-btn:hover {
  opacity: 0.8;
}

.action-btn.enable-btn {
  background-color: #4caf50;
  color: white;
  border: none;
}

.action-btn.enable-btn:hover {
  opacity: 0.8;
}

.action-btn.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
}

.action-btn.delete-btn:hover {
  opacity: 0.8;
}

.rule-item.disabled {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.rule-details {
  padding: 12px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.detail-item {
  margin-bottom: 8px;
  font-size: 13px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item label {
  font-weight: 600;
  color: #666;
  margin-right: 8px;
}

.detail-item code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #d32f2f;
}

.detail-item span {
  color: #333;
}

@media (prefers-color-scheme: dark) {
  .rule-item {
    background-color: #424242;
    border-color: #666;
  }

  .rule-item:hover {
    border-color: var(--blue, rgb(88, 164, 246));
  }

  .rule-name {
    color: #fff;
  }

  .disabled-badge {
    background-color: #ff9800;
  }

  .rule-pattern {
    color: #bbb;
  }

  .rule-pattern code {
    background-color: #383838;
    color: #ff5252;
  }

  .action-btn {
    background-color: var(--blue, rgb(88, 164, 246));
    color: #fff;
  }

  .action-btn:hover {
    opacity: 0.8;
  }

  .action-btn.disable-btn {
    background-color: #ff9800;
    color: white;
    border: none;
  }

  .action-btn.disable-btn:hover {
    opacity: 0.8;
  }

  .action-btn.enable-btn {
    background-color: #4caf50;
    color: white;
    border: none;
  }

  .action-btn.enable-btn:hover {
    opacity: 0.8;
  }

  .action-btn.delete-btn {
    background-color: #ff5252;
    color: white;
    border: none;
  }

  .action-btn.delete-btn:hover {
    opacity: 0.8;
  }

  .rule-item.disabled {
    background-color: #383838;
  }

  .rule-details {
    background-color: #383838;
    border-top-color: #666;
  }

  .detail-item label {
    color: #bbb;
  }

  .detail-item code {
    background-color: #2d2d2d;
    color: #ff5252;
  }

  .detail-item span {
    color: #fff;
  }
}
</style>
