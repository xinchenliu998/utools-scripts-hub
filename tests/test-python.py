#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试 Python 脚本 - 显示所有参数
"""

import sys
import os

print("=== Python 脚本测试 ===")
print(f"脚本路径: {__file__}")
print(f"Python 版本: {sys.version}")
print("\n接收到的参数:")

if len(sys.argv) > 1:
    for i, arg in enumerate(sys.argv[1:], 1):
        print(f"  参数 {i}: {arg}")
    print(f"\n总共接收到 {len(sys.argv) - 1} 个参数")
else:
    print("  没有传递任何参数")

print("\n按 Enter 键退出...")
input()
