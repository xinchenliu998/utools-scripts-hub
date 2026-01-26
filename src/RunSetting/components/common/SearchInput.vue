<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <input v-model="value" type="text" :placeholder="placeholder" class="search-input" />
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--blue, rgb(88, 164, 246));
}

@media (prefers-color-scheme: dark) {
  .search-input {
    background-color: #383838;
    border-color: #666;
    color: #fff;
  }

  .search-input:focus {
    border-color: var(--blue, rgb(88, 164, 246));
  }

  .search-input::placeholder {
    color: #999;
  }
}
</style>
