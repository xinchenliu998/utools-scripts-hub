<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useScripts, getAllScripts, type ScriptItem } from '@/composables/useScripts'
import IconButton from '@/RunSetting/components/common/IconButton.vue'
import HelpTooltip from '@/RunSetting/components/common/HelpTooltip.vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'

import type { EnterAction } from '@/types/global'

defineProps<{
  enterAction?: EnterAction
}>()

const { loadConfig, searchScripts } = useScripts()

const keyword = ref('')
const selectedIndex = ref(0)
const scripts = ref<ScriptItem[]>([])

// 加载配置
onMounted(() => {
  // 确保 services 已准备好
  if (window.services) {
    loadConfig()
    updateScripts()
  } else {
    // 如果 services 还没准备好，等待一下
    setTimeout(() => {
      if (window.services) {
        loadConfig()
        updateScripts()
      }
    }, 200)
  }
})

// 更新脚本列表
function updateScripts() {
  if (keyword.value) {
    scripts.value = searchScripts(keyword.value)
  } else {
    scripts.value = getAllScripts()
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
      window.utools.showNotification(`文件不存在: ${script.path}`)
      return
    }

    // 根据规则使用外部应用打开文件
    await window.services.openWithRule(script.path)

    // 成功后退出插件（可选）
    // window.utools.outPlugin()
  } catch (error: unknown) {
    const err = error as { error?: string; message?: string }
    window.utools.showNotification(`打开失败: ${err.error || err.message || '未知错误'}`)
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
      <input v-model="keyword" type="text" class="search-input" placeholder="输入文件名或关键字搜索脚本..." autofocus />
      <IconButton v-if="selectedScript" :icon="UI_ICONS.run" :tooltip="UI_TOOLTIPS.run" variant="primary"
        tooltip-position="left" @click="executeScript(selectedScript)" />
      <HelpTooltip>
        在搜索框中输入文件名或关键字快速查找脚本。
        使用 <code>↑</code> <code>↓</code> 键选择脚本，<code>Enter</code> 键或点击运行按钮执行。
        双击脚本项也可以直接运行。
        使用 "run-setting" 关键字可以管理脚本和规则。
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
      <p>没有找到匹配的脚本</p>
      <p class="hint">使用 "run-setting" 关键字添加脚本</p>
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
