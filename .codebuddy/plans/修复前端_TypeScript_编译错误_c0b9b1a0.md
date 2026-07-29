---
name: 修复前端 TypeScript 编译错误
overview: 修复 Home.tsx 中的类型错误，使 Docker 构建能够成功
todos:
  - id: read-home-tsx
    content: 读取 Home.tsx 文件，分析第 18-19 行的代码逻辑
    status: completed
  - id: fix-type-error
    content: 修复第 18 行的空字符串处理逻辑，确保返回正确的 number 类型
    status: completed
    dependencies:
      - read-home-tsx
  - id: verify-ts-compile
    content: 运行 TypeScript 编译验证类型错误已修复
    status: completed
    dependencies:
      - fix-type-error
  - id: docker-build
    content: 执行 Docker 构建确认构建成功
    status: completed
    dependencies:
      - verify-ts-compile
---

## Product Overview

修复 Home.tsx 中的 TypeScript 类型错误，使 Docker 构建能够成功

## Core Features

- 定位 Home.tsx 第 18-19 行的类型错误
- 修复空字符串处理逻辑导致的类型不匹配问题
- 验证修复后 Docker 构建成功

## Tech Stack

- 前端框架: React + TypeScript
- 构建工具: Docker + TypeScript 编译器

## 问题分析

根据错误描述：

- 第 19 行期望 `number | undefined` 类型
- 实际收到 `string | undefined` 类型
- 根源：第 18 行对空字符串的处理逻辑有误

## 修复方案

1. 检查 Home.tsx 文件第 18-19 行的代码逻辑
2. 修正空字符串处理，确保返回正确的 number 类型
3. 验证 TypeScript 编译通过
4. 执行 Docker 构建确认成功