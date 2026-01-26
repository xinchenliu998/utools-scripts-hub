# 重构文档

本文档记录项目的重构历史和改进点。

## 📋 重构历史

### 2025-01-26: UI 交互优化

#### 1. 快速模板功能优化

**AddRuleDialog.vue**:
- 修复快速模板选择"不使用模板"时的行为
- 当选择"不使用模板"时，自动清空所有表单字段（规则名称、匹配模式、指定应用、参数）
- 修复类型错误，确保 `template.pattern` 和 `template.app` 不会是 `undefined`

#### 2. 列表项按钮提示位置优化

**ScriptItem.vue 和 RuleItem.vue**:
- 添加 `index` 和 `total` props，用于判断列表项位置
- 实现动态 tooltip 位置：
  - 第一项（index === 0）：tooltip 在下方显示（`bottom`），避免被顶部遮挡
  - 最后一项（index === total - 1）：tooltip 在上方显示（`top`），避免超出屏幕底部
  - 中间项：默认在下方显示（`bottom`）

**ScriptList.vue 和 RuleList.vue**:
- 在渲染列表项时传递 `index` 和 `total` 给子组件

**ActionButtons.vue**:
- 添加 `tooltipPosition` prop，支持动态传递 tooltip 位置
- 将所有按钮的 tooltip 位置统一传递给 `IconButton` 组件

**改进效果**:
- 解决了列表两端按钮提示被遮挡或超出屏幕的问题
- 提升了用户体验，特别是在列表较长时

### 2025-01-26: 组件重构和代码优化

#### 1. 创建共享组件

为了减少代码重复，提高可维护性，创建了以下共享组件：

- **BaseDialog.vue** (113行)
  - 提取对话框的通用样式和结构
  - 支持标题、内容区域、底部操作区域
  - 统一对话框的打开/关闭逻辑

- **FormItem.vue** (约50行)
  - 统一的表单项组件
  - 支持标签、输入框、提示信息

- **FormInput.vue** (约60行)
  - 统一的表单输入组件
  - 支持文本输入和文本域
  - 统一的样式和焦点效果

- **IconButton.vue** (283行)
  - 图标按钮组件
  - 支持8个方位的tooltip
  - 支持自定义圆角、大小、颜色变体

- **ActionButtons.vue** (65行)
  - 操作按钮组
  - 统一编辑、删除、启用/禁用按钮

- **EmptyState.vue** (约30行)
  - 空状态展示组件

- **SearchInput.vue** (约50行)
  - 搜索输入框组件

- **HelpTooltip.vue** (约70行)
  - 帮助提示组件

#### 2. 重构对话框组件

**AddRuleDialog.vue**: 从 351行 减少到 209行
- 使用 BaseDialog 组件
- 使用 FormItem 和 FormInput 组件
- 提取了重复的对话框样式

**AddScriptDialog.vue**: 从 325行 减少到 195行
- 使用 BaseDialog 组件
- 使用 FormItem 和 FormInput 组件
- 提取了重复的对话框样式

#### 3. 统一导入路径

所有跨目录导入统一使用 `@` 别名：
- `../../composables/useScripts` → `@/composables/useScripts`
- `../../constants/ui` → `@/constants/ui`
- `./common/IconButton.vue` → `@/RunSetting/components/common/IconButton.vue`

#### 4. 完善类型定义

**src/types/global.d.ts**:
- 完善 `window.services` 的类型定义
- 添加 `DirectoryItem` 接口
- 添加 `OpenDialogOptions` 接口
- 添加 `EnterAction` 接口
- 添加 `ServiceError` 接口
- 移除所有 `any` 类型，使用具体类型

**类型改进**:
- `App.vue`: `enterAction: any` → `EnterAction`
- `Run/index.vue`: `enterAction: any` → `EnterAction`
- `Run/index.vue`: `error: any` → `error: unknown`
- `AddScriptDialog.vue`: `dialogOptions: any` → `OpenDialogOptions`

#### 5. 创建常量文件

**src/constants/ui.ts**:
- 统一管理UI相关常量
- 颜色、尺寸、图标、提示文字等
- 便于统一修改和维护

#### 6. 按钮图标化

所有按钮改为纯图标形式：
- 添加按钮：`+` 图标
- 编辑按钮：`✏️` 图标
- 删除按钮：`🗑️` 图标
- 启用/禁用按钮：`✓` / `⊘` 图标
- 运行按钮：`▶` 图标
- 选择文件/文件夹：`📄` / `📁` 图标
- 保存/取消：`💾` / `✗` 图标
- 关闭：`×` 图标

所有按钮悬浮时显示tooltip提示。

#### 7. 文件行数优化

重构后的文件行数：
- AddRuleDialog.vue: 209行 ✅
- AddScriptDialog.vue: 195行 ✅
- BaseDialog.vue: 113行 ✅
- IconButton.vue: 283行（功能复杂，合理）
- RuleList.vue: 151行 ✅
- ScriptList.vue: 163行 ✅
- RuleItem.vue: 约180行 ✅
- ScriptItem.vue: 约192行 ✅

所有文件都控制在合理范围内（100-200行），复杂组件不超过300行。

#### 8. 新增禁用功能

**useScripts.ts**:
- 新增 `toggleScriptDisabled(id)` 函数：切换脚本禁用状态
- 新增 `toggleRuleDisabled(id)` 函数：切换规则禁用状态
- `getAllScripts()` 函数自动过滤禁用的脚本和文件夹
- `searchScripts()` 函数自动过滤禁用的脚本

**scriptService.js**:
- 规则匹配时自动跳过已禁用的规则

**UI组件**:
- `RuleItem.vue` 和 `ScriptItem.vue` 支持显示禁用状态
- `ActionButtons.vue` 支持启用/禁用按钮
- 禁用的脚本和规则在界面上显示"已禁用"标识

#### 9. 完善类型定义

**src/types/global.d.ts**:
- 完善 `window.services` 的类型定义，移除所有 `any` 类型
- 添加 `DirectoryItem` 接口（目录项类型）
- 添加 `OpenDialogOptions` 类型（从 UToolsApi 提取）
- 添加 `EnterAction` 类型（从 UToolsApi 提取）
- 所有组件统一使用这些类型，确保类型安全

#### 10. 创建常量文件

**src/constants/ui.ts**:
- 统一管理UI相关常量
- `UI_COLORS`: 颜色常量（蓝色、橙色、绿色、红色等）
- `UI_SIZES`: 尺寸常量（按钮图标大小、内边距、圆角、间距等）
- `UI_ICONS`: 图标常量（添加、编辑、删除、启用、禁用等）
- `UI_TOOLTIPS`: 提示文字常量（所有按钮的tooltip文字）
- `UI_MESSAGES`: 消息常量（确认删除、空状态提示等）
- 便于统一修改和维护，避免硬编码

## 🎯 重构原则

1. **单一职责**: 每个组件只负责一个明确的功能
2. **代码复用**: 提取公共逻辑到共享组件
3. **类型安全**: 完善TypeScript类型定义，避免使用 `any`
4. **配置化**: 将硬编码的值提取到常量文件
5. **绝对路径**: 统一使用 `@` 别名进行导入
6. **文件大小**: 控制文件行数在100-200行，复杂组件不超过500行

## 📊 重构效果

### 代码减少
- AddRuleDialog: 351行 → 209行 (减少 40%)
- AddScriptDialog: 325行 → 195行 (减少 40%)
- 总计减少约 270行重复代码

### 可维护性提升
- 对话框样式统一管理
- 表单样式统一管理
- 按钮样式统一管理
- 类型定义完整，减少运行时错误

### 代码质量
- 消除重复代码
- 类型安全
- 组件职责清晰
- 易于扩展和维护
