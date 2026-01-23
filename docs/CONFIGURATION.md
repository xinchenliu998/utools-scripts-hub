# 配置文档

本文档介绍配置文件的格式、数据存储位置、配置项说明以及配置管理机制。

## 📁 数据存储

### 存储位置

配置文件存储在 uTools 的用户数据目录中，不同操作系统的路径如下：

- **Windows**: `%APPDATA%\uTools\utools-scripts-hub\config.json`
  - 完整路径示例: `C:\Users\用户名\AppData\Roaming\uTools\utools-scripts-hub\config.json`
- **macOS**: `~/Library/Application Support/uTools/utools-scripts-hub/config.json`
- **Linux**: `~/.config/uTools/utools-scripts-hub/config.json`

### 目录结构

```
utools-scripts-hub/
└── config.json    # 配置文件（JSON 格式）
```

如果目录不存在，程序会在首次运行时自动创建。

## 📋 配置文件格式

### 完整示例

```json
{
  "scripts": [
    {
      "id": "script-001",
      "name": "test.js",
      "path": "C:\\Users\\username\\scripts\\test.js",
      "isDirectory": false,
      "keywords": [],
      "description": "测试脚本"
    },
    {
      "id": "script-002",
      "name": "my-scripts",
      "path": "C:\\Users\\username\\scripts\\my-scripts",
      "isDirectory": true,
      "keywords": [],
      "description": "我的脚本文件夹"
    }
  ],
  "rules": [
    {
      "id": "rule-001",
      "name": "JavaScript 文件",
      "pattern": "\\.js$",
      "app": "node",
      "args": [],
      "description": "使用 Node.js 运行 JavaScript 文件"
    },
    {
      "id": "rule-002",
      "name": "PowerShell 脚本",
      "pattern": "\\.ps1$",
      "app": "powershell",
      "args": ["-ExecutionPolicy", "Bypass", "-File"],
      "description": "使用 PowerShell 运行 .ps1 脚本"
    },
    {
      "id": "rule-003",
      "name": "文本文件",
      "pattern": "\\.(txt|md|json)$",
      "app": "code",
      "args": [],
      "description": "使用 VS Code 打开文本文件"
    }
  ]
}
```

## 🔧 配置项说明

### scripts (脚本列表)

脚本列表包含所有已添加的脚本和文件夹。

#### ScriptItem 对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 脚本的唯一标识符，通常使用 UUID 或时间戳生成 |
| `name` | `string` | 是 | 脚本的显示名称，通常是文件名或文件夹名 |
| `path` | `string` | 是 | 脚本的完整文件路径或文件夹路径 |
| `isDirectory` | `boolean` | 是 | 是否为文件夹，`true` 表示文件夹，`false` 表示文件 |
| `keywords` | `string[]` | 否 | 关键字数组，用于搜索匹配（当前未使用） |
| `description` | `string` | 否 | 脚本的描述信息，用于搜索和识别 |

#### 示例

**单个脚本文件**:
```json
{
  "id": "script-001",
  "name": "hello.js",
  "path": "C:\\scripts\\hello.js",
  "isDirectory": false,
  "description": "Hello World 脚本"
}
```

**文件夹**:
```json
{
  "id": "script-002",
  "name": "my-scripts",
  "path": "C:\\scripts\\my-scripts",
  "isDirectory": true,
  "description": "我的脚本集合"
}
```

**注意**: 当 `isDirectory` 为 `true` 时，程序会在运行时递归读取文件夹内容，将文件夹中的所有文件扁平化为脚本列表。

### rules (规则列表)

规则列表定义了不同文件类型使用哪个外部应用打开。

#### RuleItem 对象

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 规则的唯一标识符 |
| `name` | `string` | 是 | 规则的显示名称 |
| `pattern` | `string` | 是 | 正则表达式，用于匹配文件名或文件扩展名 |
| `app` | `string` | 否 | 指定用于打开文件的外部应用，留空则使用系统默认应用 |
| `args` | `string[]` | 否 | 应用启动时的参数数组，多个参数用数组元素分隔 |
| `description` | `string` | 否 | 规则的描述信息 |

#### 规则匹配机制

1. **匹配顺序**: 规则按照在数组中的顺序依次匹配，找到第一个匹配的规则即停止
2. **匹配对象**: 正则表达式会同时匹配文件名和文件扩展名
3. **匹配失败**: 如果没有规则匹配，使用系统默认应用打开文件
4. **平台差异处理**:
   - **Linux**: 如果规则指定了应用（如 `node`、`python` 等），系统会自动在终端窗口中执行脚本，方便查看输出和错误信息。支持的终端模拟器包括 gnome-terminal、xterm、konsole、terminator、xfce4-terminal、mate-terminal、tilix、alacritty、kitty 等（按优先级自动检测）
   - **Mac**: 如果规则指定了应用，系统会自动在终端窗口中执行脚本。支持的终端应用包括 iTerm2、Terminal.app、Alacritty、Hyper 等（按优先级自动检测）
   - **Windows**: 直接使用 spawn 创建子进程执行，不通过终端
5. **Shell 环境**: 在 Linux 和 Mac 平台，执行脚本时会自动 source 用户的 shell 配置文件（如 `.zshrc`、`.bashrc`），确保环境变量和别名可用

#### 示例

**JavaScript 文件使用 Node.js 运行**:
```json
{
  "id": "rule-001",
  "name": "JavaScript 文件",
  "pattern": "\\.js$",
  "app": "node",
  "args": [],
  "description": "使用 Node.js 运行 .js 文件"
}
```

**PowerShell 脚本使用特定参数运行**:
```json
{
  "id": "rule-002",
  "name": "PowerShell 脚本",
  "pattern": "\\.ps1$",
  "app": "powershell",
  "args": ["-ExecutionPolicy", "Bypass", "-File"],
  "description": "绕过执行策略运行 PowerShell 脚本"
}
```

**Python 脚本使用虚拟环境**:
```json
{
  "id": "rule-003",
  "name": "Python 脚本",
  "pattern": "\\.py$",
  "app": "C:\\Python\\python.exe",
  "args": [],
  "description": "使用 Python 运行 .py 文件"
}
```

**文本文件使用 VS Code 打开**:
```json
{
  "id": "rule-004",
  "name": "文本文件",
  "pattern": "\\.(txt|md|json|yaml|yml)$",
  "app": "code",
  "args": [],
  "description": "使用 VS Code 打开文本文件"
}
```

**使用系统默认应用（不指定 app）**:
```json
{
  "id": "rule-005",
  "name": "图片文件",
  "pattern": "\\.(jpg|jpeg|png|gif|bmp)$",
  "description": "使用系统默认图片查看器打开"
}
```

## 🔍 正则表达式指南

### 常用模式

| 模式 | 说明 | 示例 |
|------|------|------|
| `\.js$` | 匹配以 `.js` 结尾的文件 | `test.js`, `script.js` |
| `\.(js\|ts)$` | 匹配 `.js` 或 `.ts` 结尾的文件 | `test.js`, `test.ts` |
| `^test` | 匹配以 `test` 开头的文件名 | `test.js`, `test-script.js` |
| `test.*` | 匹配包含 `test` 的文件名 | `test.js`, `mytest.js`, `test-script.js` |
| `\.(js\|ts\|jsx\|tsx)$` | 匹配多种 JavaScript 相关扩展名 | `test.js`, `test.ts`, `test.jsx` |

### 转义说明

在 JSON 中，正则表达式的特殊字符需要转义：

- `\` → `\\`
- `.` → `\.`
- `|` → `\|`

例如，匹配 `.js` 文件的正则表达式在 JSON 中应写为 `"\\.js$"`。

## 🔄 配置管理

### 读取配置

配置在应用启动时自动加载，也可以通过 `useScripts.ts` 中的 `loadConfig()` 函数手动加载：

```typescript
import { loadConfig } from '@/composables/useScripts'

loadConfig()
```

### 保存配置

配置会在以下情况自动保存：

1. 添加脚本
2. 删除脚本
3. 更新脚本
4. 添加规则
5. 删除规则
6. 更新规则

也可以手动调用 `saveConfig()` 函数：

```typescript
import { saveConfig } from '@/composables/useScripts'

saveConfig()
```

### 配置验证

程序在读取配置时会进行基本的验证：

1. **JSON 格式验证**: 确保文件是有效的 JSON
2. **默认值处理**: 如果配置缺失或格式错误，使用默认值：
   ```json
   {
     "scripts": [],
     "rules": []
   }
   ```
3. **类型检查**: TypeScript 类型定义确保数据结构正确

## 🛠️ 手动编辑配置

### 注意事项

1. **备份**: 在手动编辑配置文件前，建议先备份
2. **JSON 格式**: 确保 JSON 格式正确，可以使用 JSON 验证工具检查
3. **路径格式**: 
   - Windows 路径使用反斜杠 `\` 或正斜杠 `/`
   - 路径中的反斜杠在 JSON 中需要转义为 `\\`
4. **ID 唯一性**: 确保所有 `id` 字段都是唯一的
5. **正则表达式**: 确保正则表达式语法正确

### 编辑步骤

1. 关闭 uTools 插件（如果正在运行）
2. 找到配置文件位置（参考"存储位置"章节）
3. 使用文本编辑器打开 `config.json`
4. 编辑配置内容
5. 保存文件
6. 重新打开 uTools 插件

### 常见错误

1. **JSON 语法错误**: 缺少逗号、引号不匹配等
2. **路径不存在**: 脚本路径指向不存在的文件或文件夹
3. **正则表达式错误**: 正则表达式语法不正确
4. **ID 重复**: 多个脚本或规则使用相同的 ID

## 📤 导入/导出配置

### 导出配置

可以直接复制 `config.json` 文件的内容，或使用以下方式：

1. 在设置界面查看配置（未来可能添加导出功能）
2. 直接复制配置文件

### 导入配置

1. 备份当前配置
2. 将新配置内容复制到 `config.json`
3. 确保 JSON 格式正确
4. 重新加载插件

## 🔐 安全建议

1. **路径验证**: 程序会验证路径是否存在，但建议不要手动编辑为不安全的路径
2. **应用路径**: 如果指定了外部应用，确保应用路径安全可靠
3. **正则表达式**: 避免使用可能导致性能问题的复杂正则表达式
4. **备份**: 定期备份配置文件，防止数据丢失

## 📝 配置示例集合

### 开发环境配置

适合开发者的规则配置：

```json
{
  "rules": [
    {
      "id": "rule-js",
      "name": "JavaScript",
      "pattern": "\\.js$",
      "app": "node",
      "args": []
    },
    {
      "id": "rule-ts",
      "name": "TypeScript",
      "pattern": "\\.ts$",
      "app": "ts-node",
      "args": []
    },
    {
      "id": "rule-py",
      "name": "Python",
      "pattern": "\\.py$",
      "app": "python",
      "args": []
    },
    {
      "id": "rule-code",
      "name": "代码文件",
      "pattern": "\\.(js|ts|py|java|cpp|h|hpp)$",
      "app": "code",
      "args": []
    }
  ]
}
```

### 脚本管理配置

包含常用脚本的配置：

```json
{
  "scripts": [
    {
      "id": "script-backup",
      "name": "backup.ps1",
      "path": "C:\\scripts\\backup.ps1",
      "isDirectory": false,
      "description": "系统备份脚本"
    },
    {
      "id": "script-cleanup",
      "name": "cleanup.js",
      "path": "C:\\scripts\\cleanup.js",
      "isDirectory": false,
      "description": "清理临时文件"
    },
    {
      "id": "script-folder",
      "name": "常用脚本",
      "path": "C:\\scripts\\常用",
      "isDirectory": true,
      "description": "常用脚本集合"
    }
  ]
}
```
