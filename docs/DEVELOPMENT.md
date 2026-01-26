# 开发文档

本文档介绍如何搭建开发环境、项目结构、开发指南以及 API 说明。

## 📦 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7.x
- **平台**: uTools
- **语言**: TypeScript 5.x
- **依赖管理**: pnpm / npm
- **类型定义**: utools-api-types
- **拖拽排序**: vuedraggable (开发依赖)

## 🛠️ 开发环境搭建

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 9.0.0
- uTools 桌面应用

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/xinchenliu998/utools-scripts-hub
cd utools-scripts-hub
```

2. **安装依赖**

```bash
pnpm install
# 或
npm install
```

3. **启动开发服务器**

```bash
pnpm dev
# 或
npm run dev
```

开发服务器会在 `http://localhost:5173` 启动。

4. **在 uTools 中加载插件**

   - 打开 uTools 应用
   - 按 `Alt + Space` 打开 uTools 主界面
   - 点击右上角设置图标，选择「插件开发」
   - 点击「加载本地插件」
   - 选择项目根目录（`utools-scripts-hub`）
   - 插件会自动加载并启用

5. **测试插件**

   - 在 uTools 中输入 `run` 或 `运行` 进入运行界面
   - 输入 `run-setting` 或 `脚本设置` 进入设置界面

### 开发模式配置

开发模式下，`public/plugin.json` 中的 `development.main` 配置会指向本地开发服务器：

```json
{
  "development": {
    "main": "http://localhost:5173"
  }
}
```

这样修改代码后，uTools 会自动热重载，无需重新加载插件。

## 📁 项目结构

```
utools-scripts-hub/
├── public/                    # 静态资源目录
│   ├── plugin.json           # uTools 插件配置文件
│   ├── logo.png              # 插件图标
│   └── preload/              # 预加载脚本（Node.js 环境）
│       ├── services.js       # 服务入口，向渲染进程暴露 API
│       ├── package.json      # preload 依赖配置
│       └── lib/              # 预加载脚本库
│           ├── configService.js   # 配置管理服务
│           ├── fileService.js     # 文件操作服务
│           ├── scriptService.js   # 脚本执行服务（规则匹配）
│           ├── platformService.js # 平台服务（统一平台接口）
│           ├── terminalService.js # 终端服务（Linux/Mac 终端执行）
│           ├── shellService.js    # Shell 服务（shell 工具函数）
│           └── utils.js           # 工具函数（进程创建、参数转义、平台判断）
├── src/                       # 源代码目录
│   ├── App.vue               # 主应用组件（路由管理）
│   ├── main.ts               # 应用入口文件
│   ├── main.css              # 全局样式
│   ├── Run/                  # 运行脚本界面
│   │   └── index.vue
│   ├── RunSetting/           # 设置界面
│   │   ├── index.vue         # 设置主界面
│   │   └── components/       # 设置界面子组件
│   │       ├── ScriptList.vue      # 脚本列表
│   │       ├── ScriptItem.vue      # 脚本项
│   │       ├── AddScriptDialog.vue # 添加脚本对话框
│   │       ├── RuleList.vue        # 规则列表
│   │       ├── RuleItem.vue        # 规则项
│   │       ├── AddRuleDialog.vue   # 添加规则对话框
│   │       └── common/             # 共享组件
│   │           ├── BaseDialog.vue  # 基础对话框组件
│   │           ├── IconButton.vue  # 图标按钮组件
│   │           ├── ActionButtons.vue # 操作按钮组
│   │           ├── EmptyState.vue  # 空状态组件
│   │           ├── SearchInput.vue # 搜索输入框组件
│   │           ├── HelpTooltip.vue # 帮助提示组件
│   │           ├── FormItem.vue    # 表单项组件
│   │           └── FormInput.vue   # 表单输入组件
│   ├── composables/          # Vue 组合式函数
│   │   └── useScripts.ts     # 脚本管理逻辑（状态管理、CRUD、启用/禁用）
│   ├── constants/            # 常量定义
│   │   └── ui.ts             # UI相关常量（颜色、尺寸、图标、提示文字等）
│   └── types/                # TypeScript 类型定义
│       └── global.d.ts       # 全局类型声明（window.services、DirectoryItem、EnterAction等）
├── docs/                     # 文档目录
│   ├── DEVELOPMENT.md        # 开发文档（本文件）
│   ├── ARCHITECTURE.md       # 架构文档
│   └── CONFIGURATION.md      # 配置文档
├── package.json              # 项目配置和依赖
├── tsconfig.json            # TypeScript 配置
├── tsconfig.node.json       # Node.js TypeScript 配置
├── vite.config.js           # Vite 构建配置
└── README.md                # 项目说明文档
```

## 🏗️ 核心模块说明

### 1. 预加载脚本 (Preload)

预加载脚本运行在 Node.js 环境中，可以访问文件系统、执行系统命令等。通过 `window.services` 对象向渲染进程暴露 API。

**文件位置**: `public/preload/services.js`

**主要服务**:

- `configService.js`: 配置文件的读写
- `fileService.js`: 文件系统操作（检查路径、读取目录）
- `scriptService.js`: 脚本执行（根据规则匹配并打开文件）
- `platformService.js`: 平台服务（封装平台差异，提供统一接口）
- `terminalService.js`: 终端服务（Linux/Mac 平台的终端执行功能）
- `shellService.js`: Shell 服务（shell 配置、路径和命令构建）
- `utils.js`: 工具函数（进程创建、参数转义、平台判断）

### 2. 渲染进程 (Renderer)

渲染进程运行在浏览器环境中，使用 Vue 3 构建用户界面。

**核心文件**:

- `src/App.vue`: 主应用组件，负责路由管理
- `src/composables/useScripts.ts`: 脚本和规则的状态管理（包括拖拽排序功能）
- `src/Run/index.vue`: 运行脚本界面
- `src/RunSetting/index.vue`: 设置界面
- `src/RunSetting/components/ScriptList.vue`: 脚本列表组件（支持拖拽排序）
- `src/RunSetting/components/RuleList.vue`: 规则列表组件（支持拖拽排序）

### 3. 数据流

```
用户操作 (UI)
    ↓
useScripts.ts (状态管理)
    ↓
window.services (API 调用)
    ↓
preload/services.js (Node.js 环境)
    ↓
lib/*.js (具体实现)
    ↓
文件系统 / 系统命令
```

## 🔧 开发指南

### 添加新功能

1. **创建新组件**

   在 `src/` 目录下创建新的 Vue 组件：

```vue
<script setup lang="ts">
// 组件逻辑
</script>

<template>
  <!-- 组件模板 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

2. **添加路由**

   在 `src/App.vue` 中添加路由逻辑：

```vue
<template>
  <NewFeature v-else-if="route === 'new-feature'" />
</template>
```

3. **注册功能入口**

   在 `public/plugin.json` 中添加功能入口：

```json
{
  "features": [
    {
      "code": "new-feature",
      "explain": "新功能说明",
      "cmds": ["new-feature", "新功能"]
    }
  ]
}
```

### 扩展脚本打开方式

如果需要扩展脚本的打开方式，可以：

1. **在平台服务中添加新方法** (`public/preload/lib/platformService.js`):

```javascript
// 添加新的打开方式
function openWithCustomMethod(filePath) {
  // 自定义逻辑
}

module.exports = {
  // ... 现有方法
  openWithCustomMethod,
};
```

2. **在脚本服务中集成** (`public/preload/lib/scriptService.js`):

```javascript
const { openWithCustomMethod } = require("./platformService");

function openWithRule(filePath) {
  // 现有规则匹配逻辑...
  // 可以添加新的匹配规则或打开方式
  return openWithCustomMethod(filePath);
}
```

### 添加新的配置项

1. **更新类型定义**

   在 `src/composables/useScripts.ts` 中更新 `Config` 接口：

```typescript
export interface Config {
  scripts: ScriptItem[]
  rules: RuleItem[]
  newConfig?: NewConfigType  // 新增配置
}
```

2. **更新配置服务**

   在 `public/preload/lib/configService.js` 中处理新配置的默认值：

```javascript
function readConfig() {
  // ...
  return {
    scripts: [],
    rules: [],
    newConfig: defaultValue  // 默认值
  }
}
```

### 调试技巧

1. **查看控制台日志**

   - 在 uTools 中，右键点击插件图标
   - 选择「开发者工具」
   - 查看 Console 标签页的日志

2. **调试预加载脚本**

   在 `public/preload/lib/*.js` 中使用 `console.log` 输出日志，日志会显示在 uTools 的开发者工具中。

3. **热重载**

   开发模式下，修改 Vue 组件代码会自动热重载。修改预加载脚本需要重新加载插件。

## 📚 API 参考

### window.services API

预加载脚本通过 `window.services` 对象暴露以下 API：

#### 配置相关

- `readConfig()`: 读取配置文件
  - 返回: `Config` 对象
- `saveConfig(config)`: 保存配置文件
  - 参数: `config` - 配置对象

#### 文件操作相关

- `pathExists(filePath)`: 检查路径是否存在
  - 参数: `filePath` - 文件路径（字符串）
  - 返回: `boolean`
- `readDirectory(dirPath)`: 读取目录内容
  - 参数: `dirPath` - 目录路径（字符串）
  - 返回: `Array<{name: string, path: string, isDirectory: boolean, size: number}>`

#### 脚本执行相关

- `openWithRule(filePath)`: 根据规则打开文件
  - 参数: `filePath` - 文件路径（字符串）
  - 返回: `Promise<{success: boolean}>`

### useScripts Composable

`src/composables/useScripts.ts` 提供了以下函数和响应式数据：

#### 响应式数据

- `config`: 完整的配置对象
- `scripts`: 脚本列表
- `rules`: 规则列表

#### 函数

- `loadConfig()`: 加载配置
- `saveConfig()`: 保存配置
- `addScript(script)`: 添加脚本
- `removeScript(id)`: 删除脚本
- `updateScript(id, updates)`: 更新脚本
- `toggleScriptDisabled(id)`: 切换脚本禁用状态
- `updateScriptsOrder(newOrder)`: 更新脚本顺序（用于拖拽排序）
  - 参数: `newOrder` - 新的脚本顺序数组
  - 返回: `boolean` - 是否成功
- `addRule(rule)`: 添加规则
- `removeRule(id)`: 删除规则
- `updateRule(id, updates)`: 更新规则
- `toggleRuleDisabled(id)`: 切换规则禁用状态
- `updateRulesOrder(newOrder)`: 更新规则顺序（用于拖拽排序）
  - 参数: `newOrder` - 新的规则顺序数组
  - 返回: `boolean` - 是否成功
- `searchScripts(keyword)`: 搜索脚本（自动过滤禁用的脚本）
- `searchRules(keyword)`: 搜索规则
- `getAllScripts()`: 获取所有脚本（扁平化，包括文件夹中的脚本，自动过滤禁用的脚本）

## 🧪 测试

目前项目未包含自动化测试。建议在开发时手动测试以下场景：

1. **脚本管理**
   - 添加单个脚本文件
   - 添加文件夹（包括嵌套目录）
   - 编辑脚本信息
   - 删除脚本

2. **规则配置**
   - 添加规则
   - 测试正则表达式匹配
   - 测试不同应用的打开方式
   - 测试参数传递

3. **脚本运行**
   - 测试文件名搜索
   - 测试关键字搜索
   - 测试规则匹配
   - 测试默认应用打开

## 🚀 构建和发布

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建完成后，文件会输出到 `dist` 目录。

### 打包插件

1. 确保 `dist` 目录包含所有必要文件
2. 将 `dist` 目录和 `public/plugin.json`、`public/logo.png` 打包成 zip 文件
3. 在 uTools 插件市场中上传

## 📝 代码规范

- 使用 TypeScript 进行类型检查
- 使用 Vue 3 Composition API
- 组件使用 `<script setup>` 语法
- 遵循 ESLint 规则（如果配置了）
- 代码格式化使用 Prettier（如果配置了）

## 🐛 常见问题

### 开发服务器无法启动

- 检查端口 5173 是否被占用
- 检查 Node.js 版本是否符合要求
- 删除 `node_modules` 和锁文件，重新安装依赖

### 插件无法加载

- 检查 `public/plugin.json` 格式是否正确
- 检查是否选择了正确的项目根目录
- 查看 uTools 开发者工具中的错误信息

### 预加载脚本不工作

- 检查 `public/preload/services.js` 是否正确导出
- 检查 `window.services` 是否已正确注入
- 查看 uTools 开发者工具中的错误信息

## 🔗 相关资源

- [uTools 官方文档](https://u.tools/docs/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)
