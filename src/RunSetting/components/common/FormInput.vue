<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
  rows?: number
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
  <input v-if="type !== 'textarea'" v-model="value" :type="type || 'text'" :placeholder="placeholder"
    class="form-input" />
  <textarea v-else v-model="value" :placeholder="placeholder" :rows="rows || 2" class="form-textarea" />
</template>

<style scoped>
.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--blue, rgb(88, 164, 246));
}

.form-textarea {
  resize: vertical;
}

@media (prefers-color-scheme: dark) {

  .form-input,
  .form-textarea {
    background-color: #383838;
    border-color: #666;
    color: #fff;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #999;
  }
}
</style>
