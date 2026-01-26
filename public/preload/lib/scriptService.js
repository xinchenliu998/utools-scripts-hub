const path = require("node:path");
const { readConfig } = require("./configService");
const { openWithSystemApp, openWithApp } = require("./platformService");

/**
 * 脚本服务 - 处理脚本执行和文件打开逻辑
 * 通过平台服务屏蔽平台调用细节
 */

/**
 * 根据规则匹配并使用外部应用打开文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<{success: boolean}>}
 */
function openWithRule(filePath) {
  const config = readConfig();
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // 查找匹配的规则
  for (const rule of config.rules) {
    // 跳过已禁用的规则
    if (rule.disabled) {
      continue;
    }

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
  return openWithSystemApp(filePath);
}

module.exports = {
  openWithRule,
};
