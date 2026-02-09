# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2026-02-09

### Features

- 脚本列表添加复制路径功能，支持一键复制脚本路径到剪贴板
- 重置设置前添加确认对话框，防止误操作

### Improvements

- 优化国际化文案，将"排除"改为更明确的"排除文件夹"
- 优化排除文件夹占位符示例，提供更清晰的填写指引

## [1.0.4] - 2026-02-06

### Features

- 添加文件夹嵌套支持，可在编辑脚本时选择是否递归读取子文件夹
- 新增设置对话框，支持主题色、排除文件夹、按钮颜色等个性化配置
- 添加国际化支持 (i18n)，支持中文和英文界面切换

### Fix

- 修复编辑脚本/规则时点击外部区域导致窗口意外关闭的问题
- 运行界面会自动过滤掉已被脚本管理禁用的文件

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
