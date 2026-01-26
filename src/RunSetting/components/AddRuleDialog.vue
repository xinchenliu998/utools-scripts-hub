<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type RuleItem } from '@/composables/useScripts'
import BaseDialog from './common/BaseDialog.vue'
import FormItem from './common/FormItem.vue'
import FormInput from './common/FormInput.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'

const props = defineProps<{
  rule?: RuleItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addRule, updateRule } = useScripts()

const name = ref('')
const pattern = ref('')
const app = ref('')
const args = ref('')
const description = ref('')
const isEditing = ref(false)
const selectedTemplate = ref('')

onMounted(() => {
  if (props.rule) {
    isEditing.value = true
    name.value = props.rule.name
    pattern.value = props.rule.pattern
    app.value = props.rule.app || ''
    args.value = props.rule.args?.join(' ') || ''
    description.value = props.rule.description || ''
  }
})

function handleSave() {
  if (!name.value || !pattern.value) {
    window.utools.showNotification('请填写名称和匹配模式')
    return
  }

  try {
    new RegExp(pattern.value)
  } catch (e) {
    window.utools.showNotification('匹配模式不是有效的正则表达式')
    return
  }

  const ruleData: RuleItem = {
    id: props.rule?.id || `${Date.now()}-${Math.random()}`,
    name: name.value,
    pattern: pattern.value,
    app: app.value || undefined,
    args: args.value ? args.value.split(/\s+/).filter(a => a) : undefined,
    description: description.value || undefined
  }

  if (isEditing.value && props.rule) {
    updateRule(props.rule.id, ruleData)
    window.utools.showNotification('更新成功')
  } else {
    addRule(ruleData)
    window.utools.showNotification('添加成功')
  }

  emit('close')
}

function handleCancel() {
  emit('close')
}

const templates = [
  { name: '', label: '不使用模板' },
  { name: 'JavaScript 文件', pattern: '\\.js$', app: 'node' },
  { name: 'Python 文件', pattern: '\\.py$', app: 'python' },
  { name: 'PowerShell 脚本', pattern: '\\.ps1$', app: 'powershell', args: '-ExecutionPolicy Bypass -File' },
  { name: 'Bash 脚本', pattern: '\\.sh$', app: 'bash' },
  { name: '批处理文件', pattern: '\\.(bat|cmd)$', app: '' }
]

function applyTemplate() {
  if (!selectedTemplate.value) {
    // 选择"不使用模板"时，清空所有表单内容
    name.value = ''
    pattern.value = ''
    app.value = ''
    args.value = ''
    return
  }
  const template = templates.find(t => t.name === selectedTemplate.value)
  if (template && template.name) {
    name.value = template.name
    pattern.value = template.pattern || ''
    app.value = template.app || ''
    args.value = template.args || ''
  }
}
</script>

<template>
  <BaseDialog :title="isEditing ? '编辑规则' : '添加规则'" @close="handleCancel">
    <template #default>
      <div class="templates-section" v-if="!isEditing">
        <div class="template-form-item">
          <label>快速模板：</label>
          <select v-model="selectedTemplate" @change="applyTemplate" class="template-select">
            <option v-for="template in templates" :key="template.name || 'none'" :value="template.name">
              {{ template.label || template.name }}
            </option>
          </select>
        </div>
      </div>

      <FormItem label="规则名称：">
        <FormInput v-model="name" placeholder="例如: JavaScript 文件" />
      </FormItem>

      <FormItem label="匹配模式（正则表达式）：" hint="用于匹配文件名或后缀的正则表达式">
        <FormInput v-model="pattern" placeholder="例如: \.js$" />
      </FormItem>

      <FormItem label="指定应用（可选）：" hint="留空则使用默认方式执行脚本">
        <FormInput v-model="app" placeholder="例如: node, python, powershell" />
      </FormItem>

      <FormItem label="参数（可选，空格分隔）：">
        <FormInput v-model="args" placeholder="例如: -ExecutionPolicy Bypass -File" />
      </FormItem>

      <FormItem label="描述（可选）：">
        <FormInput v-model="description" type="textarea" placeholder="规则描述" :rows="2" />
      </FormItem>
    </template>

    <template #footer>
      <IconButton :icon="UI_ICONS.cancel" :tooltip="UI_TOOLTIPS.cancel" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="UI_TOOLTIPS.save" variant="primary" @click="handleSave" />
    </template>
  </BaseDialog>
</template>

<style scoped>
.templates-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.template-form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.template-form-item label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  margin: 0;
}

.template-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
  background-color: #fff;
  cursor: pointer;
}

.template-select:focus {
  outline: none;
  border-color: var(--blue, rgb(88, 164, 246));
}

@media (prefers-color-scheme: dark) {
  .templates-section {
    border-bottom-color: #666;
  }

  .template-form-item label {
    color: #fff;
  }

  .template-select {
    background-color: #383838;
    border-color: #666;
    color: #fff;
  }

  .template-select:focus {
    border-color: var(--blue, rgb(88, 164, 246));
  }
}
</style>
