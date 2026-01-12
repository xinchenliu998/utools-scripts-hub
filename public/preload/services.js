const fs = require("node:fs");
const path = require("node:path");
const { spawn, exec } = require("node:child_process");

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 读文件
  readFile(file) {
    return fs.readFileSync(file, { encoding: "utf-8" });
  },
  // 文本写入到下载目录
  writeTextFile(text) {
    const filePath = path.join(
      window.utools.getPath("downloads"),
      Date.now().toString() + ".txt"
    );
    fs.writeFileSync(filePath, text, { encoding: "utf-8" });
    return filePath;
  },
  // 图片写入到下载目录
  writeImageFile(base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url);
    if (!matchs) return;
    const filePath = path.join(
      window.utools.getPath("downloads"),
      Date.now().toString() + "." + matchs[1]
    );
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), {
      encoding: "base64",
    });
    return filePath;
  },
  // 获取数据存储路径
  getDataPath() {
    const dataPath = path.join(
      window.utools.getPath("userData"),
      "utools-scripts-hub"
    );
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    return dataPath;
  },
  // 获取配置文件路径
  getConfigPath() {
    return path.join(this.getDataPath(), "config.json");
  },
  // 读取配置
  readConfig() {
    const configPath = this.getConfigPath();
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, { encoding: "utf-8" });
        return JSON.parse(content);
      } catch (e) {
        return { scripts: [], rules: [] };
      }
    }
    return { scripts: [], rules: [] };
  },
  // 保存配置
  saveConfig(config) {
    const configPath = this.getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
      encoding: "utf-8",
    });
  },
  // 检查路径是否存在
  pathExists(filePath) {
    return fs.existsSync(filePath);
  },
  // 检查是否为目录
  isDirectory(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch {
      return false;
    }
  },
  // 读取目录内容
  readDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      return items.map((item) => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        return {
          name: item,
          path: fullPath,
          isDirectory: stat.isDirectory(),
          size: stat.size,
        };
      });
    } catch (e) {
      return [];
    }
  },
  // 执行脚本
  executeScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(scriptPath).toLowerCase();
      let command = scriptPath;
      let commandArgs = args;

      // 根据文件扩展名选择执行方式
      if (ext === ".js" || ext === ".mjs") {
        command = "node";
        commandArgs = [scriptPath, ...args];
      } else if (ext === ".py") {
        command = "python";
        commandArgs = [scriptPath, ...args];
      } else if (ext === ".ps1") {
        command = "powershell";
        commandArgs = [
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          scriptPath,
          ...args,
        ];
      } else if (ext === ".sh" || ext === ".bash") {
        command = "bash";
        commandArgs = [scriptPath, ...args];
      } else if (ext === ".bat" || ext === ".cmd") {
        command = scriptPath;
        commandArgs = args;
      }

      const process = spawn(command, commandArgs, {
        cwd: path.dirname(scriptPath),
        shell: true,
      });

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject({ stdout, stderr, code });
        }
      });

      process.on("error", (error) => {
        reject({ error: error.message });
      });
    });
  },
  // 根据规则匹配并使用外部应用打开文件
  openWithRule(filePath) {
    const config = this.readConfig();
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // 查找匹配的规则
    for (const rule of config.rules) {
      try {
        const regex = new RegExp(rule.pattern);
        if (regex.test(fileName) || regex.test(ext)) {
          // 如果规则指定了应用，使用指定的应用打开
          if (rule.app) {
            return this.openWithApp(filePath, rule.app, rule.args || []);
          }
        }
      } catch (e) {
        // 正则表达式错误，跳过
        continue;
      }
    }

    // 没有匹配的规则，使用系统默认应用打开
    return this.openWithDefaultApp(filePath);
  },
  // 使用系统默认应用打开文件
  openWithDefaultApp(filePath) {
    return new Promise((resolve, reject) => {
      try {
        // 使用 uTools 的 shell 方法打开文件
        window.utools.shellOpenPath(filePath);
        resolve({ success: true });
      } catch (error) {
        reject({ error: error.message });
      }
    });
  },
  // 使用指定应用打开文件
  openWithApp(filePath, app, args = []) {
    return new Promise((resolve, reject) => {
      try {
        // 使用 spawn 启动应用，但不等待结果
        const process = spawn(app, [filePath, ...args], {
          detached: true,
          stdio: "ignore",
          shell: true,
        });

        // 立即解除与父进程的关联，让应用独立运行
        process.unref();

        resolve({ success: true });
      } catch (error) {
        reject({ error: error.message });
      }
    });
  },
  // 根据规则匹配并执行脚本（保留用于向后兼容）
  executeByRule(filePath) {
    return this.openWithRule(filePath);
  },
  // 使用指定应用执行
  executeWithApp(filePath, app, args = []) {
    return new Promise((resolve, reject) => {
      const process = spawn(app, [filePath, ...args], {
        shell: true,
      });

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject({ stdout, stderr, code });
        }
      });

      process.on("error", (error) => {
        reject({ error: error.message });
      });
    });
  },
};
