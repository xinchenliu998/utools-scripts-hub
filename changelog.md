# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2026-02-06

### Features

- 添加文件夹嵌套支持，可在编辑脚本时选择是否递归读取子文件夹
- 添加文件夹排除配置，支持自定义排除列表
- 运行界面会自动过滤掉已被脚本管理禁用的文件
- 新增设置界面，可配置默认排除文件夹和主题色

### Fix

- 修复编辑脚本/规则时点击外部区域导致窗口意外关闭的问题

## [1.0.3] - 2026-01-30

### Features

- 脚本管理、规则配置界面添加搜索和提示功能
- 脚本管理、规则配置界面列表项支持拖拽调整顺序
- 匹配规则和脚本支持禁用选项
- 优化界面布局，将文字按钮改为图标按钮

## [1.0.2] - 2026-01-23

### Fix

- 修复 Linux、Mac 平台不弹出终端执行 bug
- 修复 Windows 平台传参顺序 bug

## [1.0.1] - 2026-01-16

### Features

- 补充插件应用介绍
- 调整项目结构，补充文档

## [1.0.0] - 2026-01-13

### Features

- 脚本管理中心：统一添加、管理脚本文件和文件夹
- 快速启动器：输入 run 快速搜索并运行脚本，输入 run-setting 进入配置界面
- 智能规则系统：按文件类型自动匹配执行程序（如 .js 用 Node，.ps1 用 PowerShell）
