<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useScripts, type RuleItem } from '@/composables/useScripts'
import BaseDialog from './common/BaseDialog.vue'
import FormItem from './common/FormItem.vue'
import FormInput from './common/FormInput.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'
import { RULE_TEMPLATES, RULE_TEMPLATES_EN, type RuleTemplate } from '@/data/ruleTemplates'

const props = defineProps<{
  rule?: RuleItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addRule, updateRule } = useScripts()
const { t, locale } = useI18n()

// 根据当前语言选择模板列表
const templates = computed<RuleTemplate[]>(() => {
  return locale.value === 'zh-CN' ? RULE_TEMPLATES : RULE_TEMPLATES_EN
})

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
    window.utools.showNotification(t('ui.notifications.ruleNameRequired'))
    return
  }

  try {
    new RegExp(pattern.value)
  } catch (e) {
    window.utools.showNotification(t('ui.notifications.invalidPattern'))
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
    window.utools.showNotification(t('ui.notifications.ruleUpdated'))
  } else {
    addRule(ruleData)
    window.utools.showNotification(t('ui.notifications.ruleAdded'))
  }

  emit('close')
}

function handleCancel() {
  emit('close')
}

function applyTemplate() {
  if (!selectedTemplate.value) {
    // 选择"不使用模板"时，清空所有表单内容
    name.value = ''
    pattern.value = ''
    app.value = ''
    args.value = ''
    return
  }
  const template = templates.value.find((t: RuleTemplate) => t.name === selectedTemplate.value)
  if (template && template.name) {
    name.value = template.name || ''
    pattern.value = template.pattern || ''
    app.value = template.app || ''
    args.value = template.args || ''
  }
}
</script>

<template>
  <BaseDialog :title="isEditing ? t('ui.dialogTitles.editRuleTitle') : t('ui.dialogTitles.addRuleTitle')" @close="handleCancel">
    <template #default>
      <div class="templates-section" v-if="!isEditing">
        <div class="template-form-item">
          <label>{{ t('ui.formLabelsExtra.quickTemplateLabel') }}</label>
          <select v-model="selectedTemplate" @change="applyTemplate" class="template-select">
            <option v-for="template in templates" :key="template.name || 'none'" :value="template.name">
              {{ template.label || template.name }}
            </option>
          </select>
        </div>
      </div>

      <FormItem :label="t('ui.formLabels.ruleName')">
        <FormInput v-model="name" :placeholder="t('ui.placeholders.ruleName')" />
      </FormItem>

      <FormItem :label="t('ui.formLabels.rulePattern')" :hint="t('ui.formLabels.rulePatternHint')">
        <FormInput v-model="pattern" :placeholder="t('ui.placeholders.rulePattern')" />
      </FormItem>

      <FormItem :label="t('ui.formLabels.ruleApp')" :hint="t('ui.formLabels.ruleAppHint')">
        <FormInput v-model="app" :placeholder="t('ui.placeholders.ruleApp')" />
      </FormItem>

      <FormItem :label="t('ui.formLabels.ruleArgs')">
        <FormInput v-model="args" :placeholder="t('ui.placeholders.ruleArgs')" />
      </FormItem>

      <FormItem :label="t('ui.formLabels.ruleDescription')">
        <FormInput v-model="description" type="textarea" :placeholder="t('ui.formLabelsExtra.ruleDescriptionPlaceholder')" :rows="2" />
      </FormItem>
    </template>

    <template #footer>
      <IconButton :icon="UI_ICONS.cancel" :tooltip="t('ui.tooltips.cancel')" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="t('ui.tooltips.save')" variant="primary" @click="handleSave" />
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
  border-color: var(--blue, rgb(88, 164, 246)));
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
