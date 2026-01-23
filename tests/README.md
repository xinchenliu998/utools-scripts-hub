# 测试脚本说明

本目录包含用于测试脚本执行功能的测试文件。

## 📋 测试脚本列表

### JavaScript 脚本

1. **test-node.js**
   - 基础 Node.js 脚本测试
   - 显示脚本路径和所有接收到的参数
   - 用于测试基本的脚本执行功能

2. **test-node-with-args.js**
   - 带参数的 Node.js 脚本测试
   - 检测常见的参数格式（--version, --help, --test）
   - 用于测试规则配置中的 `args` 参数传递

3. **test-simple-output.js**
   - 简单的输出测试脚本
   - 显示基本信息后 3 秒自动关闭
   - 用于快速验证终端是否正常打开

### Python 脚本

1. **test-python.py**
   - 基础 Python 脚本测试
   - 显示脚本路径、Python 版本和所有参数
   - 用于测试 Python 脚本执行功能

2. **test-python-with-args.py**
   - 带参数的 Python 脚本测试
   - 检测常见的参数格式（--version, --help, --test, --verbose）
   - 用于测试规则配置中的 `args` 参数传递

### Shell 脚本

1. **test-bash.sh**
   - 基础 Bash 脚本测试
   - 显示脚本路径和所有接收到的参数
   - 用于测试 Shell 脚本执行功能

2. **test-bash-with-args.sh**
   - 带参数的 Bash 脚本测试
   - 检测常见的参数格式（--version, --help, --test）
   - 用于测试规则配置中的 `args` 参数传递

### PowerShell 脚本

1. **test-powershell.ps1**
   - 基础 PowerShell 脚本测试
   - 显示脚本路径、PowerShell 版本和所有参数
   - 用于测试 PowerShell 脚本执行功能（Windows）

2. **test-powershell-with-args.ps1**
   - 带参数的 PowerShell 脚本测试
   - 检测常见的参数格式（--version, --help, --test, --verbose）
   - 用于测试规则配置中的 `args` 参数传递

### BAT 批处理脚本

1. **test-bat.bat**
   - 基础 BAT 批处理脚本测试
   - 显示脚本路径和所有接收到的参数
   - 用于测试批处理脚本执行功能（Windows）

2. **test-bat-with-args.bat**
   - 带参数的 BAT 批处理脚本测试
   - 检测常见的参数格式（--version, --help, --test）
   - 用于测试规则配置中的 `args` 参数传递

## 🧪 测试方法

### 1. 添加测试脚本到配置

在 uTools 插件中：
1. 进入设置界面（`run-setting`）
2. 在「脚本管理」中添加 `tests` 目录或单个测试文件

### 2. 配置规则

在「规则管理」中添加以下规则：

#### JavaScript 文件规则
```json
{
  "name": "JavaScript 测试",
  "pattern": "\\.js$",
  "app": "node",
  "args": []
}
```

#### 带参数的 JavaScript 规则（示例）
```json
{
  "name": "JavaScript 带参数测试",
  "pattern": "test-node-with-args\\.js$",
  "app": "node",
  "args": ["--test", "--verbose"]
}
```

#### Python 文件规则
```json
{
  "name": "Python 测试",
  "pattern": "\\.py$",
  "app": "python3",
  "args": []
}
```

#### 带参数的 Python 规则（示例）
```json
{
  "name": "Python 带参数测试",
  "pattern": "test-python-with-args\\.py$",
  "app": "python3",
  "args": ["--test", "--verbose"]
}
```

#### Bash 脚本规则
```json
{
  "name": "Bash 测试",
  "pattern": "\\.sh$",
  "app": "bash",
  "args": []
}
```

#### 带参数的 Bash 规则（示例）
```json
{
  "name": "Bash 带参数测试",
  "pattern": "test-bash-with-args\\.sh$",
  "app": "bash",
  "args": ["--test"]
}
```

#### PowerShell 脚本规则
```json
{
  "name": "PowerShell 测试",
  "pattern": "\\.ps1$",
  "app": "powershell",
  "args": ["-ExecutionPolicy", "Bypass", "-File"]
}
```

#### 带参数的 PowerShell 规则（示例）
```json
{
  "name": "PowerShell 带参数测试",
  "pattern": "test-powershell-with-args\\.ps1$",
  "app": "powershell",
  "args": ["-ExecutionPolicy", "Bypass", "-File", "--test", "--verbose"]
}
```

**注意**: PowerShell 脚本需要 `-ExecutionPolicy Bypass` 参数来绕过执行策略限制，`-File` 参数用于指定要执行的脚本文件。如果规则中配置了额外的参数（如 `--test`），这些参数会追加到脚本路径后面。

#### BAT 批处理脚本规则
```json
{
  "name": "BAT 测试",
  "pattern": "\\.bat$",
  "app": "cmd",
  "args": ["/c"]
}
```

#### 带参数的 BAT 规则（示例）
```json
{
  "name": "BAT 带参数测试",
  "pattern": "test-bat-with-args\\.bat$",
  "app": "cmd",
  "args": ["/c", "--test"]
}
```

**注意**: BAT 脚本使用 `cmd /c` 来执行。`/c` 参数表示执行命令后关闭命令提示符窗口。如果规则中配置了额外的参数，这些参数会追加到脚本路径后面。

### 3. 运行测试

1. 在运行界面（`run`）搜索测试脚本
2. 选择并执行脚本
3. 检查终端窗口是否正常打开
4. 验证参数是否正确传递

## ✅ 验证要点

### 基础功能测试
- [ ] 终端窗口能够正常打开
- [ ] 脚本能够正常执行
- [ ] 输出信息正确显示

### 参数传递测试
- [ ] 规则中配置的 `args` 参数能够正确传递
- [ ] 参数顺序正确
- [ ] 特殊字符（空格、引号等）能够正确处理

### 不同脚本类型测试
- [ ] JavaScript 脚本能够通过 `node` 执行
- [ ] Python 脚本能够通过 `python3` 执行
- [ ] Bash 脚本能够通过 `bash` 执行
- [ ] PowerShell 脚本能够通过 `powershell` 执行（Windows）
- [ ] BAT 批处理脚本能够通过 `cmd` 执行（Windows）

## 📝 注意事项

1. **执行权限**: 
   - **Linux/macOS**: 确保脚本文件具有执行权限
     ```bash
     chmod +x tests/*.sh
     chmod +x tests/*.js
     chmod +x tests/*.py
     ```
   - **Windows**: PowerShell 和 BAT 脚本通常不需要设置执行权限，但 PowerShell 脚本可能需要配置执行策略

2. **路径问题**: 如果脚本无法执行，检查：
   - 脚本路径是否正确
   - 应用是否在系统 PATH 中：
     - Linux/macOS: `node`、`python3`、`bash`
     - Windows: `powershell`、`cmd`、`node`、`python`
   - 规则配置中的 `app` 字段是否正确
   - Windows 下 PowerShell 脚本需要 `-ExecutionPolicy Bypass` 参数

3. **参数格式**: 测试带参数的脚本时，确保规则中的 `args` 数组格式正确

4. **终端兼容性**: 在 Linux 下，系统会自动查找可用的终端模拟器，如果遇到问题，检查终端是否安装

## 🔧 故障排除

### 脚本无法执行
- 检查文件路径是否存在
- 检查规则配置是否正确
- 检查应用是否在 PATH 中

### 参数未传递
- 检查规则中的 `args` 字段是否正确配置
- 检查参数格式是否为数组格式
- 查看终端输出，确认参数是否被正确接收

### 终端未打开（Linux）
- 检查系统中是否安装了终端模拟器
- 检查脚本服务是否正确检测到 Linux 系统
- 查看控制台错误信息
