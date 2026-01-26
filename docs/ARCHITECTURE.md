# 架构文档

本文档介绍项目的系统架构、模块设计、数据流和核心机制。

## 🏛️ 系统架构

### 整体架构

本项目采用 uTools 插件的标准架构，分为两个主要进程：

```
┌─────────────────────────────────────────┐
│          uTools 主进程                   │
│  ┌───────────────────────────────────┐  │
│  │     预加载进程 (Preload)           │  │
│  │  Node.js 环境                     │  │
│  │  - 文件系统操作                    │  │
│  │  - 系统命令执行                    │  │
│  │  - 配置管理                        │  │
│  └───────────────────────────────────┘  │
│           ↓ window.services             │
│  ┌───────────────────────────────────┐  │
│  │     渲染进程 (Renderer)            │  │
│  │  浏览器环境 (Vue 3)                │  │
│  │  - 用户界面                        │  │
│  │  - 状态管理                        │  │
│  │  - 用户交互                        │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 进程间通信

预加载进程通过 `window.services` 对象向渲染进程暴露 API，实现进程间通信：

```javascript
// preload/services.js
window.services = {
  readConfig,
  saveConfig,
  pathExists,
  readDirectory,
  openWithRule
}
```

渲染进程通过 `window.services` 调用这些 API：

```typescript
// src/composables/useScripts.ts
const data = window.services.readConfig()
```

## 📦 模块设计

### 1. 预加载模块 (Preload)

预加载模块运行在 Node.js 环境中，负责与系统交互。

#### 1.1 配置服务 (configService.js)

**职责**: 管理配置文件的读写

**核心函数**:
- `getDataPath()`: 获取数据存储路径
- `getConfigPath()`: 获取配置文件路径
- `readConfig()`: 读取配置文件
- `saveConfig(config)`: 保存配置文件

**数据存储位置**:
- Windows: `%APPDATA%\uTools\utools-scripts-hub\config.json`
- macOS: `~/Library/Application Support/uTools/utools-scripts-hub/config.json`
- Linux: `~/.config/uTools/utools-scripts-hub/config.json`

#### 1.2 文件服务 (fileService.js)

**职责**: 文件系统操作

**核心函数**:
- `pathExists(filePath)`: 检查路径是否存在
- `readDirectory(dirPath)`: 读取目录内容（递归支持）

#### 1.3 脚本服务 (scriptService.js)

**职责**: 脚本执行和文件打开逻辑，通过平台服务屏蔽平台调用细节

**核心函数**:
- `openWithRule(filePath)`: 根据规则匹配并打开文件

**规则匹配流程**:
```
文件路径
  ↓
提取文件名和扩展名
  ↓
遍历规则列表
  ↓
规则是否禁用？
  ├─ 是 → 跳过该规则
  └─ 否 → 继续
  ↓
正则表达式匹配
  ↓
匹配成功？
  ├─ 是 → 调用平台服务 openWithApp()
  └─ 否 → 继续下一个规则
  ↓
无匹配规则 → 调用平台服务 openWithSystemApp()
```

#### 1.4 平台服务 (platformService.js)

**职责**: 封装所有平台相关的调用细节，对外提供统一的接口，屏蔽平台差异

**核心函数**:
- `openWithSystemApp(filePath)`: 使用系统默认应用打开文件
- `executeScript(filePath, app, args)`: 统一的脚本执行接口，自动处理平台差异
- `openWithApp(filePath, app, args)`: 使用指定应用打开文件

**平台处理逻辑**:
- **Linux**: 如果指定了应用，在终端中执行（调用 `terminalService.executeInTerminal()`）
- **Mac**: 如果指定了应用，在终端中执行（调用 `terminalService.executeInMacTerminal()`）
- **Windows**: 使用 spawn 直接执行，不通过终端

#### 1.5 终端服务 (terminalService.js)

**职责**: 提供 Linux 和 Mac 平台的终端执行功能

**核心函数**:
- `executeInTerminal(filePath, app, args)`: 在 Linux 终端中执行脚本
- `executeInMacTerminal(filePath, app, args)`: 在 Mac 终端中执行脚本
- `findTerminalEmulator()`: 查找可用的 Linux 终端模拟器
- `findMacTerminalEmulator()`: 查找可用的 Mac 终端模拟器

**Linux 终端执行机制**:
1. 自动检测可用的终端模拟器（按优先级）
2. 获取用户默认 shell 和配置文件
3. 构建 shell 命令（包含 source 配置文件和执行命令）
4. 在终端窗口中执行脚本命令
5. 保持终端窗口打开，方便查看脚本输出

**支持的 Linux 终端模拟器（按优先级）**:
- gnome-terminal
- xterm
- konsole
- terminator
- xfce4-terminal
- mate-terminal
- tilix
- alacritty
- kitty

**Mac 终端执行机制**:
1. 自动检测可用的终端应用（按优先级）
2. 获取用户默认 shell 和配置文件
3. 构建 shell 命令（包含 source 配置文件和执行命令）
4. 使用 AppleScript 或命令行方式在终端中执行
5. 保持终端窗口打开，方便查看脚本输出

**支持的 Mac 终端应用（按优先级）**:
- iTerm2
- Terminal.app
- Alacritty
- Hyper

#### 1.6 Shell 服务 (shellService.js)

**职责**: 提供 shell 相关的工具函数，用于处理 shell 配置、路径和命令构建

**核心函数**:
- `getUserShell()`: 获取用户的默认 shell 名称
- `getUserShellPath()`: 获取 shell 完整路径
- `getShellConfigFile(shellName)`: 获取 shell 配置文件路径
- `escapeShellArg(arg)`: 转义 shell 参数（用于 shell -c 内部）
- `buildShellCommand(command, configFile)`: 构建 shell 命令（包含 source 配置文件和执行命令）

#### 1.7 工具函数 (utils.js)

**职责**: 提供进程创建、参数转义和平台判断功能

**核心函数**:
- `getPlatform()`: 获取当前平台类型
- `isMac()`: 判断是否为 Mac 平台
- `isLinux()`: 判断是否为 Linux 平台
- `isWindows()`: 判断是否为 Windows 平台
- `escapeArg(arg, mode, platform)`: 统一的参数转义函数
  - `mode`: 转义模式 - `'spawn'` (双引号，用于 spawn)、`'shell'` (单引号，用于 shell -c) 或 `'applescript'` (用于 AppleScript 字符串)
  - `platform`: 平台类型，默认自动检测
- `createSpawnProcess(command, args, options, platform)`: 创建子进程（处理带空格的路径）

### 2. 渲染进程模块 (Renderer)

渲染进程模块运行在浏览器环境中，使用 Vue 3 构建用户界面。

#### 2.1 应用入口 (App.vue)

**职责**: 路由管理和组件调度

**核心逻辑**:
- 监听 uTools 插件进入/退出事件
- 根据 `action.code` 路由到不同组件
- 支持的路由:
  - `run`: 运行脚本界面
  - `run-setting`: 设置界面

#### 2.2 状态管理 (useScripts.ts)

**职责**: 脚本和规则的统一状态管理

**设计模式**: Vue 3 Composition API + 响应式状态

**核心数据结构**:
```typescript
interface Config {
  scripts: ScriptItem[]  // 脚本列表
  rules: RuleItem[]      // 规则列表
}

interface ScriptItem {
  id: string
  name: string
  path: string
  isDirectory: boolean
  keywords?: string[]
  description?: string
  disabled?: boolean    // 是否禁用（禁用的脚本不会在运行界面显示）
}

interface RuleItem {
  id: string
  name: string
  pattern: string        // 正则表达式
  app?: string          // 指定应用
  args?: string[]       // 启动参数
  description?: string
  disabled?: boolean    // 是否禁用（禁用的规则不会参与匹配）
}
```

**类型定义位置**:
- `src/composables/useScripts.ts`: ScriptItem, RuleItem, Config
- `src/types/global.d.ts`: DirectoryItem, OpenDialogOptions, EnterAction, Window.services

**核心功能**:
- 配置的加载和保存
- 脚本的 CRUD 操作
- 脚本启用/禁用切换（`toggleScriptDisabled`）
- 规则的 CRUD 操作
- 规则启用/禁用切换（`toggleRuleDisabled`）
- 脚本搜索（支持文件名、路径、描述匹配）
- 脚本扁平化（处理文件夹嵌套，自动过滤禁用的脚本和文件夹）

#### 2.3 运行界面 (Run/index.vue)

**职责**: 脚本搜索和运行

**核心功能**:
- 关键字搜索脚本
- 键盘导航（上下箭头、Enter）
- 脚本列表展示
- 执行脚本（调用 `window.services.openWithRule`）

**搜索算法**:
1. 精确文件名匹配（最高优先级）
2. 文件名包含匹配
3. 路径包含匹配
4. 描述包含匹配

#### 2.4 设置界面 (RunSetting/index.vue)

**职责**: 脚本和规则的管理

**子组件**:
- `ScriptList.vue`: 脚本列表展示
- `ScriptItem.vue`: 单个脚本项
- `AddScriptDialog.vue`: 添加/编辑脚本对话框
- `RuleList.vue`: 规则列表展示
- `RuleItem.vue`: 单个规则项
- `AddRuleDialog.vue`: 添加/编辑规则对话框

**共享组件** (`common/`):
- `BaseDialog.vue`: 基础对话框组件（提取对话框通用样式和结构，支持标题、内容区域、底部操作区域）
- `IconButton.vue`: 图标按钮组件（支持8个方位的tooltip、自定义圆角、多种颜色变体）
- `ActionButtons.vue`: 操作按钮组（编辑、删除、启用/禁用）
- `EmptyState.vue`: 空状态组件（统一空状态展示）
- `SearchInput.vue`: 搜索输入框组件（统一搜索框样式）
- `HelpTooltip.vue`: 帮助提示组件（统一帮助提示）
- `FormItem.vue`: 表单项组件（标签、输入框、提示）
- `FormInput.vue`: 表单输入组件（支持文本和文本域）

**常量文件**:
- `src/constants/ui.ts`: UI相关常量（颜色、尺寸、图标、提示文字等）

## 🔄 数据流

### 配置加载流程

```
应用启动
  ↓
useScripts.ts 初始化
  ↓
调用 loadConfig()
  ↓
window.services.readConfig()
  ↓
configService.readConfig()
  ↓
读取 config.json 文件
  ↓
解析 JSON
  ↓
更新响应式状态 config.value
  ↓
UI 自动更新
```

### 脚本运行流程

```
用户在运行界面选择脚本
  ↓
调用 window.services.openWithRule(scriptPath)
  ↓
scriptService.openWithRule(filePath)
  ↓
读取配置，获取规则列表
  ↓
遍历规则，正则匹配文件名
  ↓
匹配成功？
  ├─ 是 → platformService.openWithApp(filePath, rule.app, rule.args)
  │         ↓
  │        检测操作系统
  │         ↓
  │        Linux 且指定了 app？
  │         ├─ 是 → terminalService.executeInTerminal()
  │         │         ↓
  │         │        查找终端模拟器
  │         │         ↓
  │         │        构建 shell 命令（包含 source 配置文件）
  │         │         ↓
  │         │        在终端窗口执行
  │         │
  │         Mac 且指定了 app？
  │         ├─ 是 → terminalService.executeInMacTerminal()
  │         │         ↓
  │         │        查找终端应用
  │         │         ↓
  │         │        构建 shell 命令（包含 source 配置文件）
  │         │         ↓
  │         │        使用 AppleScript 或命令行在终端执行
  │         │
  │         └─ 否 → 使用 spawn 直接创建子进程执行
  │
  └─ 否 → platformService.openWithSystemApp(filePath)
  ↓
立即返回（不等待结果）
```

### 脚本添加流程

```
用户在设置界面填写脚本信息
  ↓
调用 addScript(script)
  ↓
检查脚本是否已存在（路径重复检查）
  ↓
添加到 config.value.scripts
  ↓
调用 saveConfig()
  ↓
window.services.saveConfig(config)
  ↓
configService.saveConfig(config)
  ↓
序列化为 JSON
  ↓
写入 config.json 文件
```

## 🔐 安全机制

### 路径验证

- 在打开文件前，使用 `pathExists()` 验证路径是否存在
- 防止路径遍历攻击（通过 uTools 的文件选择对话框限制）

### 进程隔离

- 预加载进程和渲染进程隔离
- 渲染进程无法直接访问文件系统
- 所有文件操作必须通过预加载进程的 API

### 错误处理

- 所有异步操作都有错误处理
- 文件操作失败时返回错误信息
- UI 层显示友好的错误提示

## 🎯 设计模式

### 1. 组合式函数模式 (Composables)

使用 Vue 3 的 Composition API，将状态管理逻辑封装在 `useScripts.ts` 中：

```typescript
export function useScripts() {
  return {
    config: computed(() => config.value),
    scripts: computed(() => config.value.scripts),
    rules: computed(() => config.value.rules),
    // ... 其他函数
  }
}
```

### 2. 服务层模式

预加载脚本采用服务层模式，将不同功能模块化：

- `configService`: 配置管理
- `fileService`: 文件操作
- `scriptService`: 脚本执行（规则匹配）
- `platformService`: 平台服务（统一平台接口）
- `terminalService`: 终端服务（Linux/Mac 终端执行）
- `shellService`: Shell 服务（shell 工具函数）
- `utils`: 工具函数（进程创建、参数转义、平台判断）

### 3. 组件复用模式

渲染进程采用组件复用模式，提取公共组件：

- `BaseDialog`: 基础对话框（提取对话框通用样式和结构，支持标题、内容区域、底部操作区域）
- `FormItem`: 表单项组件（统一表单样式，支持标签、输入框、提示信息）
- `FormInput`: 表单输入组件（统一输入框样式，支持文本输入和文本域）
- `IconButton`: 图标按钮组件（统一按钮样式和行为，支持8个方位的tooltip、自定义圆角、多种颜色变体）
- `ActionButtons`: 操作按钮组（统一操作按钮，支持编辑、删除、启用/禁用）
- `EmptyState`: 空状态组件（统一空状态展示）
- `SearchInput`: 搜索输入框组件（统一搜索框样式）
- `HelpTooltip`: 帮助提示组件（统一帮助提示）

### 4. 常量配置模式

将UI相关的硬编码值提取到常量文件中，便于统一管理和维护：

- `src/constants/ui.ts`: 统一管理颜色、尺寸、图标、提示文字等UI常量

### 5. 响应式状态管理

使用 Vue 3 的响应式系统管理状态，无需引入额外的状态管理库：

```typescript
const config = ref<Config>({ scripts: [], rules: [] })
```

## 🔧 扩展点

### 添加新的文件打开方式

可以通过以下方式扩展新的打开方式：

1. **在平台服务中添加新方法** (`platformService.js`):
```javascript
function openWithCustomMethod(filePath) {
  // 自定义逻辑
}

module.exports = {
  // ... 现有方法
  openWithCustomMethod,
};
```

2. **在脚本服务中集成** (`scriptService.js`):
```javascript
const { openWithCustomMethod } = require("./platformService");

function openWithRule(filePath) {
  // 现有规则匹配逻辑
  // 可以在这里添加新的匹配逻辑
  return openWithCustomMethod(filePath)
}
```

### 添加新的配置项

1. 更新 `useScripts.ts` 中的类型定义
2. 更新 `configService.js` 中的默认值处理
3. 在 UI 中添加配置界面

### 添加新的搜索策略

在 `useScripts.ts` 的 `searchScripts()` 函数中可以添加新的搜索策略：

```typescript
export function searchScripts(keyword: string) {
  // 现有搜索逻辑
  // 可以添加新的匹配策略，如：
  // - 拼音匹配
  // - 模糊匹配
  // - 标签匹配
}
```

## 📊 性能考虑

### 脚本扁平化优化

`getAllScripts()` 函数在每次调用时都会递归遍历文件夹，对于大量脚本可能影响性能。可以考虑：

1. 缓存扁平化结果
2. 延迟加载文件夹内容
3. 使用虚拟滚动（如果脚本数量很大）

### 配置读写优化

配置文件采用同步读写，对于大型配置可能阻塞。可以考虑：

1. 使用异步读写
2. 批量操作时合并写入
3. 使用数据库替代 JSON 文件（如果配置很大）

## 🚀 未来改进方向

1. **性能优化**
   - 脚本列表虚拟滚动
   - 配置读写异步化
   - 搜索算法优化

2. **功能扩展**
   - 脚本分组/标签
   - 脚本执行历史
   - 脚本收藏
   - 快捷键自定义

3. **用户体验**
   - 拖拽排序
   - 批量操作
   - 导入/导出配置
   - 主题切换

4. **开发体验**
   - 单元测试
   - E2E 测试
   - 代码格式化工具
   - CI/CD 流程
