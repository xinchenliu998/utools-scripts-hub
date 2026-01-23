#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试 Python 脚本 - 带参数测试
这个脚本应该通过规则配置，使用 python 命令并传递参数运行
"""

import sys
import os

print("=== Python 脚本参数测试 ===")
print(f"脚本路径: {__file__}")
print(f"Python 版本: {sys.version}")

args = sys.argv[1:]
print("\n接收到的所有参数:")
for i, arg in enumerate(args, 1):
    print(f"  [{i-1}]: {arg}")

# 测试常见的参数格式
if '--version' in args or '-v' in args:
    print("\n✓ 检测到版本参数")
    print(f"Python 版本信息: {sys.version}")

if '--help' in args or '-h' in args:
    print("\n✓ 检测到帮助参数")
    print("这是一个测试脚本，用于验证参数传递")

if '--test' in args:
    print("\n✓ 检测到测试参数")
    print("参数传递功能正常！")

if '--verbose' in args or '-V' in args:
    print("\n✓ 检测到详细输出参数")
    print("详细模式已启用")

if len(args) == 0:
    print("\n⚠ 警告: 没有接收到任何参数")
    print("如果规则配置了 args，应该能看到参数列表")

print("\n按 Enter 键退出...")
input()
