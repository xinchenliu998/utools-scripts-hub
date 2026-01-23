#!/usr/bin/env node

// 简单的输出测试脚本 - 用于测试终端是否正常打开

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// ES module 中获取当前文件路径的方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Hello from Node.js!');
console.log('如果你看到这条消息，说明终端已经成功打开。');
console.log('\n脚本信息:');
console.log('  脚本路径:', __filename);
console.log('  Node.js 版本:', process.version);
console.log('  参数数量:', process.argv.length - 2);

if (process.argv.length > 2) {
  console.log('\n传递的参数:');
  process.argv.slice(2).forEach((arg, i) => {
    console.log(`  ${i + 1}. ${arg}`);
  });
}

console.log('\n3 秒后自动关闭...');
setTimeout(() => {
  process.exit(0);
}, 3000);
