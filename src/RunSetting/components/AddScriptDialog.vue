<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type ScriptItem } from '@/composables/useScripts'
import BaseDialog from './common/BaseDialog.vue'
import FormItem from './common/FormItem.vue'
import FormInput from './common/FormInput.vue'
import IconButton from './common/IconButton.vue'
import { UI_ICONS, UI_TOOLTIPS } from '@/constants/ui'

const props = defineProps<{
  script?: ScriptItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { addScript, updateScript } = useScripts()

const name = ref('')
const path = ref('')
const isDirectory = ref(false)
const description = ref('')
const isEditing = ref(false)

import type { OpenDialogOptions } from '@/types/global'

onMounted(() => {
  if (props.script) {
    isEditing.value = true
    name.value = props.script.name
    path.value = props.script.path
    isDirectory.value = props.script.isDirectory
    description.value = props.script.description || ''
  }
})

function handleSelectFile(selectAsDirectory: boolean) {
  const dialogOptions: OpenDialogOptions = {
    title: selectAsDirectory ? '选择文件夹' : '选择文件'
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
    window.utools.showNotification('请填写名称和路径')
    return
  }

  if (!window.services.pathExists(path.value)) {
    window.utools.showNotification('路径不存在')
    return
  }

  const scriptData: ScriptItem = {
    id: props.script?.id || `${Date.now()}-${Math.random()}`,
    name: name.value,
    path: path.value,
    isDirectory: isDirectory.value,
    description: description.value || undefined
  }

  if (isEditing.value && props.script) {
    updateScript(props.script.id, scriptData)
    window.utools.showNotification('更新成功')
  } else {
    addScript(scriptData)
    window.utools.showNotification('添加成功')
  }

  emit('close')
}

function handleCancel() {
  emit('close')
}
</script>

<template>
  <BaseDialog :title="isEditing ? '编辑脚本' : '添加脚本/文件夹'" @close="handleCancel">
    <template #default>
      <FormItem label="名称：">
        <FormInput v-model="name" placeholder="脚本名称" />
      </FormItem>

      <FormItem label="路径：">
        <div class="path-input-group">
          <FormInput v-model="path" :placeholder="isDirectory ? '文件夹路径' : '脚本路径'" />
          <IconButton v-if="!isDirectory" :icon="UI_ICONS.file" :tooltip="UI_TOOLTIPS.selectFile" variant="primary"
            @click="handleSelectFile(false)" />
          <IconButton v-else :icon="UI_ICONS.folder" :tooltip="UI_TOOLTIPS.selectFolder" variant="primary"
            @click="handleSelectFile(true)" />
        </div>
        <div class="folder-option">
          <label class="folder-checkbox">
            <input v-model="isDirectory" type="checkbox" />
            <span>文件夹（支持嵌套）</span>
          </label>
        </div>
      </FormItem>

      <FormItem label="描述：">
        <FormInput v-model="description" type="textarea" placeholder="脚本描述（可选）" :rows="3" />
      </FormItem>
    </template>

    <template #footer>
      <IconButton :icon="UI_ICONS.cancel" :tooltip="UI_TOOLTIPS.cancel" variant="default" @click="handleCancel" />
      <IconButton :icon="UI_ICONS.save" :tooltip="UI_TOOLTIPS.save" variant="primary" @click="handleSave" />
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

.folder-option {
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
