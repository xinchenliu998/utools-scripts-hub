const fs = require("node:fs");
const path = require("node:path");

// 获取数据存储路径
function getDataPath() {
  const dataPath = path.join(
    window.utools.getPath("userData"),
    "utools-scripts-hub"
  );
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
  return dataPath;
}

// 获取配置文件路径
function getConfigPath() {
  return path.join(getDataPath(), "config.json");
}

// 读取配置
function readConfig() {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, { encoding: "utf-8" });
      return JSON.parse(content);
    } catch (e) {
      return { scripts: [], rules: [] };
    }
  }
  return { scripts: [], rules: [] };
}

// 保存配置
function saveConfig(config) {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
    encoding: "utf-8",
  });
}

module.exports = {
  readConfig,
  saveConfig,
};
