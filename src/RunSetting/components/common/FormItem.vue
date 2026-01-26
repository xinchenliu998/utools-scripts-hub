<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
}>()
</script>

<template>
  <div class="form-item">
    <label>{{ label }}</label>
    <slot />
    <div v-if="hint" class="form-hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.form-item {
  margin-bottom: 16px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

@media (prefers-color-scheme: dark) {
  .form-item label {
    color: #fff;
  }

  .form-hint {
    color: #999;
  }
}
</style>
