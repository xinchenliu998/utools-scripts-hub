<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type ScriptItem } from '@/composables/useScripts'
import BaseDialog from './common/BaseDialog.vue'
import FormItem from './common/FormItem.vue'
import FormInput from './common/FormInput.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS } from '@/constants/ui'
import { useI18n } from '@/utils/i18n'
import type { OpenDialogOptions } from '@/types/global'

const props = defineProps<{
  script?: ScriptItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addScript, updateScript } = useScripts()
const { t } = useI18n()

const name = ref('')
const path = ref('')
const isDirectory = ref(false)
const description = ref('')
const isEditing = ref(false)
const recursive = ref(false)
const excludeFolders = ref('')

onMounted(() => {
  if (props.script) {
    isEditing.value = true
    name.value = props.script.name
    path.value = props.script.path
    isDirectory.value = props.script.isDirectory
    description.value = props.script.description || ''
    if (props.script.isDirectory) {
      recursive.value = props.script.recursive || false
      excludeFolders.value = props.script.excludeFolders?.join(', ') || ''
    }
  }
})

function handleSelectFile(selectAsDirectory: boolean) {
  const dialogOptions: OpenDialogOptions = {
    title: selectAsDirectory ? t.DIALOG_OPTIONS.selectFolder.title : t.DIALOG_OPTIONS.selectFile.title
  }

  if (selectAsDirectory) {
    dialogOptions.properties = ['openDirectory']
    isDirectory.value = true
  } else {
    dialogOptions.properties = ['openFile']
    isDirectory.value = false
  }

  const files = window.utools.showOpenDialog(dialogOptions)
  if (files && files.length > 0) {
    const selectedPath = files[0]
    path.value = selectedPath
    name.value = selectedPath.split(/[/\\]/).pop() || ''
  }
}

function handleSave() {
  if (!name.value || !path.value) {
    window.utools.showNotification(t.NOTIFICATIONS.scriptNameRequired)
    return
  }

  if (!window.services.pathExists(path.value)) {
    window.utools.showNotification(t.NOTIFICATIONS.pathNotExists)
    return
  }

  const scriptData: ScriptItem = {
    id: props.script?.id || `${Date.now()}-${Math.random()}`,
    name: name.value,
    path: path.value,
    isDirectory: isDirectory.value,
    description: description.value || undefined,
    recursive: isDirectory.value ? recursive.value : undefined,
    excludeFolders: isDirectory.value && excludeFolders.value
      ? excludeFolders.value.split(',').map(s => s.trim()).filter(Boolean)
      : undefined
  }

  if (isEditing.value && props.script) {
    updateScript(props.script.id, scriptData)
    window.utools.showNotification(t.NOTIFICATIONS.scriptUpdated)
  } else {
    addScript(scriptData)
    window.utools.showNotification(t.NOTIFICATIONS.scriptAdded)
  }

  emit('close')
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <BaseDialog :title="isEditing ? t.DIALOG_TITLES.editScriptTitle : t.DIALOG_TITLES.addScriptTitle" @close="handleCancel">
    <template #default>
      <FormItem :label="t.FORM_LABELS.scriptName">
        <FormInput v-model="name" :placeholder="t.PLACEHOLDERS.scriptName" />
      </FormItem>

      <FormItem :label="t.FORM_LABELS.scriptPath">
        <div class="path-input-group">
          <FormInput v-model="path" :placeholder="isDirectory ? t.FORM_LABELS.scriptFolderPath : t.FORM_LABELS.scriptFilePath" />
          <IconButton tooltip-position="left" v-if="!isDirectory" :icon="UI_ICONS.file"
            :tooltip="t.UI_TOOLTIPS.selectFile" variant="primary" @click="handleSelectFile(false)" />
          <IconButton tooltip-position="left" v-else :icon="UI_ICONS.folder" :tooltip="t.UI_TOOLTIPS.selectFolder"
            variant="primary" @click="handleSelectFile(true)" />
        </div>
        <div class="folder-row">
          <label class="folder-checkbox">
            <input v-model="isDirectory" type="checkbox" />
            <span>{{ t.FORM_LABELS.scriptFolder }}</span>
          </label>
          <label v-if="isDirectory" class="folder-checkbox">
            <input v-model="recursive" type="checkbox" />
            <span>{{ t.FORM_LABELS.scriptRecursive }}</span>
          </label>
        </div>
        <div v-if="isDirectory" class="folder-options">
          <FormItem :label="t.FORM_LABELS.scriptExclude">
            <FormInput v-model="excludeFolders" :placeholder="t.PLACEHOLDERS.excludeFolders" />
          </FormItem>
        </div>
      </FormItem>

      <FormItem :label="t.FORM_LABELS.scriptDescriptionLabel">
        <FormInput v-model="description" type="textarea" :placeholder="t.PLACEHOLDERS.scriptDescription" :rows="3" />
      </FormItem>
    </template>

    <template #footer>
      <IconButton :icon="UI_ICONS.cancel" :tooltip="t.UI_TOOLTIPS.cancel" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="t.UI_TOOLTIPS.save" variant="primary" @click="handleSave" />
    </template>
  </BaseDialog>
</template>

<style scoped>
.path-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.path-input-group :deep(.form-input) {
  flex: 1;
}

.folder-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}

.folder-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  margin: 0;
  padding: 0;
  font-weight: normal;
  line-height: 1.5;
}

.folder-options {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #eee;
}

.folder-options :deep(.form-item) {
  margin-bottom: 0;
}

.folder-checkbox input[type="checkbox"] {
  margin: 0;
  margin-right: 8px;
  cursor: pointer;
  vertical-align: middle;
  flex-shrink: 0;
}

.folder-checkbox span {
  user-select: none;
}

@media (prefers-color-scheme: dark) {
  .folder-checkbox {
    color: #fff;
  }
}
</style>
