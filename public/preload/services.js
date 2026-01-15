const { readConfig, saveConfig } = require("./lib/configService");
const { pathExists, readDirectory } = require("./lib/fileService");
const { openWithRule } = require("./lib/scriptService");

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 配置相关
  readConfig,
  saveConfig,
  // 文件操作相关
  pathExists,
  readDirectory,
  // 脚本执行相关
  openWithRule,
};
