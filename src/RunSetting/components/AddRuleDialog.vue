<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScripts, type RuleItem } from '../../composables/useScripts'

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

  // 验证正则表达式
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

// 常用规则模板
const templates = [
  { name: 'JavaScript 文件', pattern: '\\.js$', app: 'node' },
  { name: 'Python 文件', pattern: '\\.py$', app: 'python' },
  { name: 'PowerShell 脚本', pattern: '\\.ps1$', app: 'powershell', args: '-ExecutionPolicy Bypass -File' },
  { name: 'Bash 脚本', pattern: '\\.sh$', app: 'bash' },
  { name: '批处理文件', pattern: '\\.(bat|cmd)$', app: '' }
]

function applyTemplate(template: typeof templates[0]) {
  name.value = template.name
  pattern.value = template.pattern
  app.value = template.app
  args.value = template.args || ''
}
</script>

<template>
  <div class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>{{ isEditing ? '编辑规则' : '添加规则' }}</h3>
        <button @click="handleCancel" class="close-btn">×</button>
      </div>

      <div class="dialog-body">
        <div class="templates-section" v-if="!isEditing">
          <div class="templates-label">快速模板：</div>
          <div class="templates-list">
            <button
              v-for="template in templates"
              :key="template.name"
              @click="applyTemplate(template)"
              class="template-btn"
            >
              {{ template.name }}
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>规则名称：</label>
          <input v-model="name" type="text" placeholder="例如: JavaScript 文件" />
        </div>

        <div class="form-item">
          <label>匹配模式（正则表达式）：</label>
          <input v-model="pattern" type="text" placeholder="例如: \.js$" />
          <div class="form-hint">用于匹配文件名或后缀的正则表达式</div>
        </div>

        <div class="form-item">
          <label>指定应用（可选）：</label>
          <input v-model="app" type="text" placeholder="例如: node, python, powershell" />
          <div class="form-hint">留空则使用默认方式执行脚本</div>
        </div>

        <div class="form-item">
          <label>参数（可选，空格分隔）：</label>
          <input v-model="args" type="text" placeholder="例如: -ExecutionPolicy Bypass -File" />
        </div>

        <div class="form-item">
          <label>描述（可选）：</label>
          <textarea v-model="description" placeholder="规则描述" rows="2"></textarea>
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

.templates-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.templates-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.templates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-btn {
  padding: 6px 12px;
  background-color: #f0f7ff;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--blue, rgb(88, 164, 246));
  transition: all 0.2s;
}

.template-btn:hover {
  background-color: #e3f2fd;
  border-color: var(--blue, rgb(88, 164, 246));
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

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
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

  .templates-section {
    border-bottom-color: #666;
  }

  .templates-label {
    color: #bbb;
  }

  .template-btn {
    background-color: #1e3a5f;
    border-color: #3d5a80;
    color: #90caf9;
  }

  .template-btn:hover {
    background-color: #2d4a6b;
    border-color: #90caf9;
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

  .form-hint {
    color: #999;
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
