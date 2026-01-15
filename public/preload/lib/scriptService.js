const path = require("node:path");
const { createSpawnProcess } = require("./utils");
const { readConfig } = require("./configService");

// 使用系统默认应用打开文件
function openWithDefaultApp(filePath) {
  return new Promise((resolve, reject) => {
    try {
      // 使用 uTools 的 shell 方法打开文件
      window.utools.shellOpenPath(filePath);
      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 使用指定应用打开文件
function openWithApp(filePath, app, args = []) {
  return new Promise((resolve, reject) => {
    try {
      // 使用辅助函数创建进程，自动处理带空格的路径
      const process = createSpawnProcess(app, [filePath, ...args], {
        detached: true,
        stdio: "ignore",
      });

      // 立即解除与父进程的关联，让应用独立运行
      process.unref();

      resolve({ success: true });
    } catch (error) {
      reject({ error: error.message });
    }
  });
}

// 根据规则匹配并使用外部应用打开文件
function openWithRule(filePath) {
  const config = readConfig();
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // 查找匹配的规则
  for (const rule of config.rules) {
    try {
      const regex = new RegExp(rule.pattern);
      if (regex.test(fileName) || regex.test(ext)) {
        // 如果规则指定了应用，使用指定的应用打开
        if (rule.app) {
          return openWithApp(filePath, rule.app, rule.args || []);
        }
      }
    } catch (e) {
      // 正则表达式错误，跳过
      continue;
    }
  }

  // 没有匹配的规则，使用系统默认应用打开
  return openWithDefaultApp(filePath);
}

module.exports = {
  openWithRule,
  openWithDefaultApp,
  openWithApp,
};
