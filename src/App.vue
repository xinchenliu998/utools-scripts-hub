<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import Run from '@/Run/index.vue'
import RunSetting from '@/RunSetting/index.vue'

import type { EnterAction } from '@/types/global'

const route = ref('')
const enterAction = ref<EnterAction>({} as EnterAction)

onMounted(() => {
  // 监听插件进入事件
  window.utools.onPluginEnter((action: EnterAction) => {
    console.log('Plugin entered:', action)
    route.value = action.code
    enterAction.value = action
  })

  // 监听插件退出事件
  window.utools.onPluginOut((isKill: boolean) => {
    console.log('Plugin out:', isKill)
    route.value = ''
  })

  // 尝试获取当前进入的动作（如果已经进入）
  nextTick(() => {
    try {
      // 检查是否有当前进入的动作
      const currentAction = (window.utools as any).getEnterAction?.()
      if (currentAction) {
        route.value = currentAction.code
        enterAction.value = currentAction
      }
    } catch (e) {
      console.log('No current action')
    }
  })
})
</script>

<template>
  <div v-if="!route" class="loading-container">
    <p>正在加载...</p>
  </div>
  <Run v-else-if="route === 'run'" :enterAction="enterAction" />
  <RunSetting v-else-if="route === 'run-setting'" :enterAction="enterAction" />
  <div v-else class="unknown-route">
    <p>未知的路由: {{ route }}</p>
  </div>
</template>

<style scoped>
.loading-container,
.unknown-route {
  padding: 40px;
  text-align: center;
  color: #666;
}

@media (prefers-color-scheme: dark) {

  .loading-container,
  .unknown-route {
    color: #bbb;
  }
}
</style>
