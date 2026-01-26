<script setup lang="ts">
defineProps<{
  message: string
  hint?: string
}>()
</script>

<template>
  <div class="empty-state">
    <p>{{ message }}</p>
    <p v-if="hint" class="hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
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
</style>
