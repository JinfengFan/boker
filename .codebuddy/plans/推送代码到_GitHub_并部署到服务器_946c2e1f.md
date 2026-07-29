---
name: 推送代码到 GitHub 并部署到服务器
overview: 将修复后的代码推送到 GitHub，然后拉取到轻量服务器部署
todos:
  - id: push-code-to-github
    content: 将修复后的代码推送到 GitHub 仓库
    status: completed
  - id: query-lighthouse-server
    content: 使用 [integration:lighthouse] 查询可用的 Lighthouse 服务器实例
    status: completed
    dependencies:
      - push-code-to-github
  - id: connect-lighthouse-server
    content: 使用 [integration:lighthouse] 连接到目标轻量服务器
    status: completed
    dependencies:
      - query-lighthouse-server
  - id: pull-latest-code
    content: 在服务器上从 GitHub 拉取最新代码
    status: completed
    dependencies:
      - connect-lighthouse-server
  - id: deploy-application
    content: 安装依赖、构建项目并启动应用服务
    status: completed
    dependencies:
      - pull-latest-code
---

## 需求概述

将修复 TypeScript 错误后的代码推送到 GitHub，然后部署到腾讯云 Lighthouse 轻量服务器

## 核心功能

- 将修改的文件 (frontend/src/pages/Home.tsx) 推送到 GitHub 仓库
- 连接腾讯云 Lighthouse 轻量服务器
- 在服务器上拉取最新代码
- 部署并启动应用服务

## 技术方案

- 版本控制: Git
- 代码托管: GitHub
- 服务器: 腾讯云 Lighthouse 轻量服务器
- 部署方式: 通过 lighthouse 集成进行云端部署

## 部署流程

1. 本地代码推送到 GitHub
2. 服务器从 GitHub 拉取最新代码
3. 安装依赖并构建项目
4. 启动应用服务

## Agent 扩展

### Integration

- **lighthouse**
- 用途: 查询 Lighthouse 实例并执行云端部署操作
- 预期结果: 成功连接到轻量服务器并完成应用部署