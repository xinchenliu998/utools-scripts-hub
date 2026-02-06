<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormItem from '../common/FormItem.vue'
import FormInput from '../common/FormInput.vue'
import { useSettings, OPTIONAL_EXCLUDE_FOLDERS } from '@/composables/useSettings'
import { useI18n } from '@/utils/i18n'

const {
  settings,
  loadSettings,
  updateDefaultExcludeFolders,
} = useSettings()
const { t } = useI18n()

// 可选的排除文件夹列表
const optionalExcludeFolders = [...OPTIONAL_EXCLUDE_FOLDERS]

// 自定义排除文件夹
const customExcludeInput = ref('')
const selectedExcludeFolders = ref<Set<string>>(new Set())
const customExcludeFolders = ref<string[]>([])

function isFolderExcluded(key: string): boolean {
  return selectedExcludeFolders.value.has(key)
}

function toggleFolder(key: string) {
  if (selectedExcludeFolders.value.has(key)) {
    selectedExcludeFolders.value.delete(key)
  } else {
    selectedExcludeFolders.value.add(key)
  }
}

function getFinalExcludeFolders(): string[] {
  const result = [...selectedExcludeFolders.value]
  return [...new Set([...result, ...customExcludeFolders.value])]
}

function handleAddCustomFolders() {
  if (!customExcludeInput.value.trim()) return

  const newFolders = customExcludeInput.value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const existing = new Set(customExcludeFolders.value)
  for (const folder of newFolders) {
    if (!existing.has(folder) && !optionalExcludeFolders.find(o => o.key === folder)) {
      customExcludeFolders.value.push(folder)
    }
  }

  customExcludeInput.value = ''
}

function handleDeleteCustomFolder(folder: string) {
  if (window.confirm(t.UI_MESSAGES.confirmDeleteCustomFolder.replace('${name}', folder))) {
    customExcludeFolders.value = customExcludeFolders.value.filter(f => f !== folder)
  }
}

onMounted(() => {
  loadSettings()

  selectedExcludeFolders.value = new Set(
    settings.value.defaultExcludeFolders.filter(
      folder => optionalExcludeFolders.find(o => o.key === folder)
    )
  )

  customExcludeFolders.value = settings.value.defaultExcludeFolders.filter(
    folder => !optionalExcludeFolders.find(o => o.key === folder)
  )
  customExcludeInput.value = ''
})
</script>

<template>
  <div class="exclude-tab">
    <p class="hint-text">{{ t.HINTS.excludeToggle }}</p>
    <div class="folder-grid">
      <button
        v-for="folder in optionalExcludeFolders"
        :key="folder.key"
        :class="['folder-tag', { active: isFolderExcluded(folder.key) }]"
        @click="toggleFolder(folder.key)"
      >
        {{ folder.label }}
      </button>
      <button
        v-for="folder in customExcludeFolders"
        :key="folder"
        class="folder-tag custom active"
        @click="handleDeleteCustomFolder(folder)"
      >
        {{ folder }}
      </button>
    </div>
    <FormItem :label="t.FORM_LABELS.excludeCustom">
      <FormInput
        v-model="customExcludeInput"
        :placeholder="t.PLACEHOLDERS.excludeFoldersExample"
        @keydown.enter.prevent="handleAddCustomFolders"
      />
    </FormItem>
  </div>
</template>

<style scoped>
.exclude-tab {
  animation: fadeIn 0.2s ease;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px;
}

.folder-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.folder-tag {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.folder-tag:hover {
  border-color: var(--btn-primary, #58a4f6);
  background: #f0f7ff;
}

.folder-tag.active {
  background: var(--btn-primary, #58a4f6);
  color: white;
  border-color: var(--btn-primary, #58a4f6);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-color-scheme: dark) {
  .folder-tag {
    background: #333;
    border-color: #555;
    color: #bbb;
  }

  .folder-tag.active {
    background: var(--btn-primary, #58a4f6);
    color: white;
  }

  .hint-text {
    color: #777;
  }
}
</style>
