<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useScripts, getAllScripts, type ScriptItem } from '@/composables/useScripts'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import HelpTooltip from '@/RunSetting/components/common/HelpTooltip.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'
import { useSettings, getDefaultExcludeFolders } from '@/composables/useSettings'

import type { EnterAction } from '@/types/global'

defineProps<{
  enterAction?: EnterAction
}>()

const { loadConfig, searchScripts } = useScripts()
const { loadSettings } = useSettings()
const { t } = useI18n()

const keyword = ref('')
const selectedIndex = ref(0)
const scripts = ref<ScriptItem[]>([])

// 递归收集文件夹中的文件
function collectFilesFromFolder(folder: ScriptItem, excludeFolders: string[]): ScriptItem[] {
  const files: ScriptItem[] = []
  try {
    const entries = window.services.readDirectory(folder.path)
    for (const entry of entries) {
      // 构建完整路径
      const fullPath = entry.path.startsWith(folder.path)
        ? entry.path
        : `${folder.path}/${entry.name}`

      if (entry.isDirectory) {
        // 检查是否在排除列表中
        const folderName = entry.name
        if (excludeFolders.includes(folderName)) {
          continue
        }
        // 根据是否递归设置决定是否遍历子文件夹
        if (folder.recursive) {
          // 递归时优先使用父文件夹的 excludeFolders 设置
          const subExcludeFolders = folder.excludeFolders || excludeFolders
          const subFiles = collectFilesFromFolder({
            ...entry,
            id: `${folder.id}-${fullPath}`,
            name: entry.name,
            path: fullPath,
            isDirectory: true,
            recursive: true,
            excludeFolders: subExcludeFolders
          }, subExcludeFolders)
          files.push(...subFiles)
        }
      } else {
        files.push({
          ...entry,
          id: `${folder.id}-${fullPath}`,
          name: entry.name,
          path: fullPath,
          isDirectory: false
        })
      }
    }
  } catch (e) {
    console.error('Failed to read directory:', folder.path, e)
  }
  return files
}

// 收集所有文件（递归遍历文件夹）
function collectAllFiles(allScripts: ScriptItem[]): ScriptItem[] {
  const defaultExcludeFolders = getDefaultExcludeFolders()
  const result: ScriptItem[] = []
  // 独立脚本 Map：路径 -> 脚本对象（包含 disabled 状态）
  const independentScripts = new Map<string, ScriptItem>()

  // 第一步：收集所有独立脚本（非文件夹）的路径和配置
  for (const script of allScripts) {
    if (!script.isDirectory) {
      independentScripts.set(script.path, script)
    }
  }

  // 第二步：添加未被禁用的独立脚本到结果集
  for (const script of allScripts) {
    if (!script.isDirectory && !script.disabled) {
      result.push(script)
    }
  }

  // 第三步：收集文件夹中的文件（排除已在独立脚本中或被独立脚本禁用的）
  for (const script of allScripts) {
    if (script.disabled) continue

    if (script.isDirectory) {
      // 优先使用脚本自己的 excludeFolders，否则使用全局设置
      const scriptExcludeFolders = script.excludeFolders || defaultExcludeFolders
      // 遍历文件夹
      const folderFiles = collectFilesFromFolder(script, scriptExcludeFolders)

      for (const file of folderFiles) {
        // 如果该文件在独立脚本中存在，跳过（独立脚本优先，包括禁用状态）
        if (!independentScripts.has(file.path)) {
          result.push(file)
        }
      }
    }
  }

  return result
}

// 加载配置
onMounted(() => {
  // 确保 services 已准备好
  if (window.services) {
    loadSettings() // 先加载设置，确保排除文件夹配置已读取
    loadConfig()
    updateScripts()
  } else {
    // 如果 services 还没准备好，等待一下
    setTimeout(() => {
      if (window.services) {
        loadSettings()
        loadConfig()
        updateScripts()
      }
    }, 200)
  }
})

// 更新脚本列表
function updateScripts() {
  const allScripts = getAllScripts()
  const collectedFiles = collectAllFiles(allScripts)

  if (keyword.value) {
    const lowerKeyword = keyword.value.toLowerCase()
    // 在收集的文件中进行模糊搜索
    scripts.value = collectedFiles.filter(script => {
      const nameMatch = script.name.toLowerCase().includes(lowerKeyword)
      const pathMatch = script.path.toLowerCase().includes(lowerKeyword)
      const descMatch = script.description?.toLowerCase().includes(lowerKeyword)
      const keywordsMatch = script.keywords?.some(k => k.toLowerCase().includes(lowerKeyword))
      return nameMatch || pathMatch || descMatch || keywordsMatch
    })
  } else {
    scripts.value = collectedFiles
  }
  selectedIndex.value = 0
}

// 监听关键词变化
watch(keyword, () => {
  updateScripts()
})

// 当前选中的脚本
const selectedScript = computed(() => {
  return scripts.value[selectedIndex.value] || null
})

// 键盘导航
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, scripts.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (event.key === 'Enter' && selectedScript.value) {
    event.preventDefault()
    executeScript(selectedScript.value)
  }
}

// 运行脚本（通过外部应用）
async function executeScript(script: ScriptItem) {
  try {
    // 检查文件是否存在
    if (!window.services.pathExists(script.path)) {
      window.utools.showNotification(`${t('ui.notifications.fileNotExists')}${script.path}`)
      return
    }

    // 根据规则使用外部应用打开文件
    await window.services.openWithRule(script.path)

    // 成功后退出插件（可选）
    // window.utools.outPlugin()
  } catch (error: unknown) {
    const err = error as { error?: string; message?: string }
    window.utools.showNotification(`${t('ui.notifications.openFailed')}${err.error || err.message || '未知错误'}`)
  }
}

// 选择脚本
function selectScript(index: number) {
  selectedIndex.value = index
}

// 聚焦搜索框
onMounted(() => {
  const input = document.querySelector('.search-input') as HTMLInputElement
  if (input) {
    input.focus()
  }
})
</script>

<template>
  <div class="run-container" @keydown="handleKeyDown" tabindex="0">
    <div class="search-section">
      <input v-model="keyword" type="text" class="search-input" :placeholder="t('ui.placeholders.searchScriptRun')" autofocus />
      <IconButton v-if="selectedScript" :icon="UI_ICONS.run" :tooltip="t('ui.tooltips.run')" variant="primary"
        tooltip-position="left" @click="executeScript(selectedScript)" />
      <HelpTooltip>
        {{ t('ui.hints.runHelp') }}
      </HelpTooltip>
    </div>

    <div class="scripts-list" v-if="scripts.length > 0">
      <div v-for="(script, index) in scripts" :key="script.id"
        :class="['script-item', { active: index === selectedIndex }]" @click="selectScript(index)"
        @dblclick="executeScript(script)">
        <div class="script-name">{{ script.name }}</div>
        <div class="script-path">{{ script.path }}</div>
        <div class="script-description" v-if="script.description">
          {{ script.description }}
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <p>{{ t('ui.hints.noMatchScript') }}</p>
      <p class="hint">{{ t('ui.hints.addScriptKeyword') }}</p>
    </div>
  </div>
</template>

<style scoped>
.run-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--blue, rgb(88, 164, 246));
}

.scripts-list {
  flex: 1;
  overflow-y: auto;
}

.script-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff;
}

.script-item:hover {
  border-color: var(--blue, rgb(88, 164, 246));
  background-color: #f5f5f5;
}

.script-item.active {
  border-color: var(--blue, rgb(88, 164, 246));
  background-color: #e3f2fd;
}

.script-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
}

.script-path {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  word-break: break-all;
}

.script-description {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 8px;
}

@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #424242;
    border-color: #666;
    color: #fff;
  }

  .script-item {
    background-color: #424242;
    border-color: #666;
  }

  .script-item:hover {
    background-color: #505050;
  }

  .script-item.active {
    background-color: #1e3a5f;
  }

  .script-name {
    color: #fff;
  }

  .script-path {
    color: #bbb;
  }

  .script-description {
    color: #999;
  }
}
</style>
