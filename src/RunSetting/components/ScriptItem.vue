<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ScriptItem } from '../../composables/useScripts'

const props = defineProps<{
  script: ScriptItem
}>()

const emit = defineEmits<{
  edit: [script: ScriptItem]
  delete: [id: string]
}>()

const showDetails = ref(false)

const displayPath = computed(() => {
  return props.script.path
})

function handleEdit() {
  emit('edit', props.script)
}

function handleDelete() {
  emit('delete', props.script.id)
}
</script>

<template>
  <div class="script-item">
    <div class="script-header" @click="showDetails = !showDetails">
      <div class="script-info">
        <div class="script-name">
          <span class="icon">{{ script.isDirectory ? '📁' : '📄' }}</span>
          {{ script.name }}
        </div>
        <div class="script-path">{{ displayPath }}</div>
      </div>
      <div class="script-actions">
        <button @click.stop="handleEdit" class="action-btn">编辑</button>
        <button @click.stop="handleDelete" class="action-btn delete-btn">删除</button>
      </div>
    </div>

    <div v-if="showDetails" class="script-details">
      <div class="detail-item" v-if="script.description">
        <label>描述：</label>
        <span>{{ script.description }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.script-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.2s;
}

.script-item:hover {
  border-color: var(--blue, rgb(88, 164, 246));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.script-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
}

.script-info {
  flex: 1;
  min-width: 0;
}

.script-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.script-name .icon {
  font-size: 16px;
}

.script-path {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.script-actions {
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

.action-btn.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
}

.action-btn.delete-btn:hover {
  opacity: 0.8;
}

.script-details {
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

.detail-item span {
  color: #333;
}

@media (prefers-color-scheme: dark) {
  .script-item {
    background-color: #424242;
    border-color: #666;
  }

  .script-item:hover {
    border-color: var(--blue, rgb(88, 164, 246));
  }

  .script-name {
    color: #fff;
  }

  .script-path {
    color: #bbb;
  }

  .action-btn {
    background-color: var(--blue, rgb(88, 164, 246));
    color: #fff;
  }

  .action-btn:hover {
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

  .script-details {
    background-color: #383838;
    border-top-color: #666;
  }

  .detail-item label {
    color: #bbb;
  }

  .detail-item span {
    color: #fff;
  }
}
</style>
