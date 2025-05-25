# 二体碰撞虚拟实验（Collision Lab）

本项目为基于 React + matter.js 的一维二体碰撞虚拟探究实验网页，适合物理教学、科学探究等场景，支持参数调整、任务引导、AI 反馈。

## 主要功能
- **探究场景**：滑块可拖动设置初始位置，matter.js 实时模拟碰撞。
- **参数控制**：支持设置质量、初速度、摩擦力、恢复系数（含预设选项）。
- **任务板块**：循序渐进的实验任务，逐步引导学生探究。
- **反馈提交**：提供实验总结模板，支持 AI 反馈（可对接大模型 API）。
- **美观交互**：现代化 UI，动画流畅，右侧任务/反馈板块可展开收起。

## 快速开始

1. **安装依赖**

```bash
npm install
```

2. **本地开发**

```bash
npm run dev
```

浏览器自动打开 [http://localhost:5173](http://localhost:5173)

3. **打包发布**

```bash
npm run build
```

打包后静态文件在 `dist/` 目录，可直接部署到静态服务器。

## 目录结构

```
collision-lab/
  ├─ public/
  ├─ src/
  │   ├─ components/   # 主要功能组件
  │   ├─ api/          # AI 反馈接口
  │   ├─ App.jsx
  │   ├─ main.jsx
  │   └─ index.css
  ├─ package.json
  ├─ vite.config.js
  └─ README.md
```

## AI 反馈对接

- 默认使用模拟接口，实际应用可在 `src/api/aiFeedback.js` 中配置真实大模型 API。

## 预览

![](https://img.shields.io/badge/demo-%E4%BA%8C%E4%BD%93%E7%A2%B0%E6%92%9E%E8%99%9A%E6%8B%9F%E5%AE%9E%E9%AA%8C-blue)

---

如有问题欢迎反馈！ 