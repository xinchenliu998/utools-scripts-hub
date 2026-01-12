<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type ScriptItem } from '../../composables/useScripts'

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

onMounted(() => {
  if (props.script) {
    isEditing.value = true
    name.value = props.script.name
    path.value = props.script.path
    isDirectory.value = props.script.isDirectory
    description.value = props.script.description || ''
  }
})

function handleSelectFile() {
  const dialogOptions: any = {
    title: isDirectory.value ? '选择文件夹' : '选择文件'
  }
  
  if (isDirectory.value) {
    dialogOptions.properties = ['openDirectory']
  } else {
    dialogOptions.properties = ['openFile']
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
  <div class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ isEditing ? '编辑脚本' : '添加脚本/文件夹' }}</h3>
        <button @click="handleCancel" class="close-btn">×</button>
      </div>

      <div class="dialog-body">
        <div class="form-item">
          <label>名称：</label>
          <input v-model="name" type="text" placeholder="脚本名称" />
        </div>

        <div class="form-item">
          <label>路径：</label>
          <div class="path-input-group">
            <input v-model="path" type="text" :placeholder="isDirectory ? '文件夹路径' : '脚本路径'" />
            <button @click="handleSelectFile" class="select-btn">{{ isDirectory ? '选择文件夹' : '选择文件' }}</button>
          </div>
          <div class="folder-option">
            <label class="folder-checkbox">
              <input v-model="isDirectory" type="checkbox" />
              <span>文件夹（支持嵌套）</span>
            </label>
          </div>
        </div>

        <div class="form-item">
          <label>描述：</label>
          <textarea v-model="description" placeholder="脚本描述（可选）" rows="3"></textarea>
        </div>
      </div>

      <div class="dialog-footer">
        <button @click="handleCancel" class="cancel-btn">取消</button>
        <button @click="handleSave" class="save-btn">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.dialog-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

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

.form-item input[type="text"],
.form-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-item input[type="text"]:focus,
.form-item textarea:focus {
  outline: none;
  border-color: var(--blue, rgb(88, 164, 246));
}

.form-item textarea {
  resize: vertical;
}

.form-item input[type="checkbox"] {
  margin-right: 6px;
}

.path-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.path-input-group input {
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

.select-btn {
  padding: 8px 16px;
  background-color: var(--blue, rgb(88, 164, 246));
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.select-btn:hover {
  opacity: 0.8;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.save-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  opacity: 0.8;
}

.save-btn {
  background-color: var(--blue, rgb(88, 164, 246));
  color: white;
}

.save-btn:hover {
  opacity: 0.8;
}

@media (prefers-color-scheme: dark) {
  .dialog-content {
    background-color: #424242;
  }

  .dialog-header {
    border-bottom-color: #666;
  }

  .dialog-header h3 {
    color: #fff;
  }

  .close-btn {
    color: #bbb;
  }

  .close-btn:hover {
    background-color: #505050;
  }

  .form-item label {
    color: #fff;
  }

  .form-item input[type="text"],
  .form-item textarea {
    background-color: #383838;
    border-color: #666;
    color: #fff;
  }

  .folder-checkbox {
    color: #fff;
  }

  .select-btn {
    background-color: var(--blue, rgb(88, 164, 246));
    color: #fff;
  }

  .select-btn:hover {
    opacity: 0.8;
  }

  .dialog-footer {
    border-top-color: #666;
  }

  .cancel-btn {
    background-color: #606060;
    color: #fff;
  }
}
</style>
