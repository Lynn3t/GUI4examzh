# exam-zh 网页版编辑器

为 exam-zh LaTeX 试卷模板创建的 TypeScript 可交互网页版本，适用于不熟悉 LaTeX 用户的编辑器。

## 项目简介

本项目是一个基于 React + TypeScript 的网页编辑器，用于创建 exam-zh 格式的试卷。用户无需编写 LaTeX 代码，即可通过图形界面创建、编辑和导出试卷。

## 设计风格

- **UI 框架**：Material Design
- **配色方案**：黑白风格（黑白灰为主）
- **字体**：Roboto + 系统默认字体

## 功能特性

### 已实现
- ✅ 试卷基础信息编辑（标题、科目、考试时间等）
- ✅ 题目管理（添加、删除、选择）
- ✅ 多种题型支持：
  - 选择题（单选）
  - 填空题
  - 解答题
  - 判断题
  - 连线题
- ✅ 数据持久化（localStorage）
- ✅ 黑白风格 Material Design 界面

### 计划中
- [ ] LaTeX 代码生成
- [ ] 公式预览（KaTeX）
- [ ] 导出 .tex 文件
- [ ] Cloudflare Workers PDF 编译
- [ ] 撤销/重做功能
- [ ] 题目拖拽排序

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
GUI4examzh/
├── src/
│   ├── components/        # 可复用组件
│   ├── stores/           # 状态管理（Zustand）
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   └── pages/            # 页面组件
├── public/               # 静态资源
├── exam-zh-doc/          # exam-zh 文档
├── exam-zh-v0.2.6/       # exam-zh 示例文件
└── PLAN.MD               # 项目规划文档
```

## 技术栈

- **前端框架**：React 18 + TypeScript
- **状态管理**：Zustand
- **UI 组件库**：Material-UI (MUI)
- **公式渲染**：KaTeX（计划中）
- **构建工具**：Vite
- **部署**：Cloudflare Pages

## 开发计划

详见 [PLAN.MD](PLAN.MD)

## 参考文档

- [exam-zh 文档](exam-zh-doc/exam-zh-doc.md)
- [exam-zh 示例](exam-zh-v0.2.6/)
- [Material Design 指南](https://material.io/design)

## 许可证

本项目基于 exam-zh 模板开发，遵循其许可证。
