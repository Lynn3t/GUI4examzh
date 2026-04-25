# exam-zh 网页版编辑器 - 项目规划

## 项目概述

为 exam-zh LaTeX 试卷模板创建一个 TypeScript 可交互网页版本，适用于不熟悉 LaTeX 用户的编辑器。

## 设计风格

- **UI 框架**：Material Design
- **配色方案**：黑白风格（黑白灰为主，强调色使用深灰）
- **字体**：系统默认字体 + 等宽字体（代码/公式）
- **图标**：Material Icons

## 项目架构

### 技术栈
- **前端框架**：React 18 + TypeScript
- **状态管理**：Zustand
- **UI 组件库**：Material-UI (MUI)
- **公式渲染**：KaTeX
- **构建工具**：Vite
- **部署**：Cloudflare Pages + Wrangler

### 目录结构
```
GUI4examzh/
├── src/
│   ├── components/        # 可复用组件
│   ├── stores/           # 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   └── pages/            # 页面组件
├── public/               # 静态资源
├── tests/                # 测试文件
└── docs/                 # 文档
```

## 功能规划

### 阶段一：基础网页界面搭建（MVP）

**目标**：创建可交互的基础编辑器界面

1. **试卷基础信息编辑**
   - 试卷标题
   - 科目
   - 考试时间
   - 考生信息字段

2. **题型管理**
   - 选择题（单选/多选）
   - 填空题
   - 解答题
   - 判断题
   - 连线题

3. **题目编辑器**
   - 题干编辑（支持 Markdown 语法）
   - 选项管理（选择题）
   - 答案设置
   - 分数设置

4. **公式编辑器界面**
   - 公式输入框（置空功能）
   - 公式预览

5. **UI 设计**
   - Material Design 组件
   - 黑白灰配色
   - 响应式布局

### 阶段二：功能填充

**目标**：实现导出和预览功能

1. **LaTeX 代码生成**
   - 将试卷数据转换为 LaTeX 代码
   - 支持 exam-zh 模板语法

2. **导出功能**
   - 导出 .tex 文件
   - 导出 JSON 数据

3. **预览功能**
   - 实时预览 LaTeX 渲染效果
   - 使用 KaTeX 渲染数学公式

4. **Cloudflare 集成**
   - 调用 Workers API 编译 PDF
   - PDF 下载功能

### 阶段三：优化

**目标**：提升用户体验

1. **数据持久化**
   - localStorage 自动保存
   - JSON 导入导出

2. **编辑功能**
   - 撤销/重做
   - 题目拖拽排序
   - 批量操作

3. **性能优化**
   - 组件懒加载
   - 虚拟滚动（长列表）

## 开发计划

### 第 1 周：项目初始化
- [ ] 创建项目基础结构
- [ ] 配置 TypeScript + React + Vite
- [ ] 安装 Material-UI 和相关依赖
- [ ] 初始化 Git 仓库

### 第 2 周：数据模型与基础组件
- [ ] 设计试卷数据模型
- [ ] 创建基础 UI 组件（按钮、输入框、卡片等）
- [ ] 实现试卷信息编辑面板

### 第 3 周：题型编辑器
- [ ] 实现选择题编辑器
- [ ] 实现填空题编辑器
- [ ] 实现解答题编辑器
- [ ] 实现判断题编辑器

### 第 4 周：LaTeX 生成与预览
- [ ] 实现 LaTeX 代码生成器
- [ ] 集成 KaTeX 公式渲染
- [ ] 实现导出功能

### 第 5 周：优化与部署
- [ ] 实现数据持久化
- [ ] 优化 UI/UX
- [ ] 部署到 Cloudflare Pages

## 数据模型设计

### 试卷（Exam）
```typescript
interface Exam {
  id: string;
  title: string;
  subject: string;
  examTime: string;
  totalPoints: number;
  information: {
    name: string;
    class: string;
    studentId: string;
  };
  sections: Section[];
}
```

### 题目（Question）
```typescript
interface Question {
  id: string;
  type: 'choice' | 'fillin' | 'problem' | 'judgment' | 'line';
  content: string;
  points: number;
  answer?: string;
  options?: string[]; // 选择题选项
  solution?: string; // 解答题解答
}
```

## 部署方案

### 开发环境
- Vite 开发服务器
- 热重载

### 生产环境
- Cloudflare Pages 部署静态资源
- Cloudflare Workers 处理 PDF 编译

## 注意事项

1. **LaTeX 编译**：由于浏览器无法直接运行 xelatex，需要通过 Cloudflare Workers API 调用后端服务
2. **公式渲染**：使用 KaTeX 进行前端预览，确保与 LaTeX 输出一致
3. **数据安全**：所有数据存储在本地，不上传到服务器（PDF 编译除外）
4. **兼容性**：支持现代浏览器（Chrome、Firefox、Safari、Edge）

## 参考文档

- [exam-zh 文档](exam-zh-doc/exam-zh-doc.md)
- [exam-zh 示例](exam-zh-v0.2.6/)
- [Material Design 指南](https://material.io/design)
- [React 文档](https://react.dev/)
- [Material-UI 文档](https://mui.com/)

---

**创建时间**：2026-04-25
**最后更新**：2026-04-25
