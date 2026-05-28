# 📋 Smart Clipboard Manager

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg" alt="Platform">
</p>

<p align="center">
  <a href="#简体中文">简体中文</a> |
  <a href="#繁體中文">繁體中文</a> |
  <a href="#english">English</a>
</p>

---

<a name="简体中文"></a>
## 🎉 项目介绍

**Smart Clipboard Manager** 是一款功能强大的跨平台剪贴板管理器，旨在解决日常工作和开发中剪贴板历史丢失、内容难以查找的痛点。

### 💡 灵感来源

在日常开发工作中，我们经常需要复制粘贴多个代码片段、URL、颜色值等内容。然而系统默认的剪贴板只能保存最后一次复制的内容，导致之前的重要信息丢失。本项目正是为了解决这一痛点而诞生。

### ✨ 自研差异化亮点

- **智能内容识别**：自动识别 URL、邮箱、代码、颜色值等多种内容类型
- **隐私保护**：自动检测并排除密码、API Key 等敏感内容
- **轻量级架构**：基于 Electron + TypeScript，内存占用低
- **现代化 UI**：支持深色/浅色主题，界面简洁美观

---

## ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 📋 **剪贴板历史** | 自动保存最近 1000 条剪贴板记录 |
| 🔍 **智能搜索** | 支持全文搜索和标签筛选 |
| 🏷️ **自动分类** | 智能识别 URL、邮箱、代码、颜色等内容类型 |
| ⭐ **收藏功能** | 重要内容可收藏，方便快速访问 |
| 🔒 **隐私保护** | 自动排除密码、Token 等敏感信息 |
| 🎯 **去重机制** | 相同内容不会重复存储 |
| ⌨️ **全局快捷键** | `Ctrl+Shift+V` 快速呼出 |
| 🌙 **主题切换** | 支持浅色/深色/跟随系统三种模式 |
| 🌐 **多语言支持** | 简体中文、繁體中文、English |
| 🧹 **自动清理** | 支持按天数自动清理旧记录 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **操作系统**: Windows 10+ / macOS 10.14+ / Linux (Ubuntu 18.04+)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/gitstq/smart-clipboard-manager.git

# 进入项目目录
cd smart-clipboard-manager

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 启动应用
npm run dev
```

### 一键运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run dist

# 全平台打包
npm run dist:all
```

---

## 📖 详细使用指南

### 基础操作

1. **呼出应用**：按 `Ctrl+Shift+V`（可自定义）
2. **复制内容**：点击任意历史记录即可复制到剪贴板
3. **搜索内容**：在搜索框输入关键词，支持模糊匹配
4. **收藏项目**：点击星标按钮将常用内容加入收藏夹

### 内容类型识别

应用会自动识别以下内容类型：

| 类型 | 图标 | 示例 |
|------|------|------|
| 链接 | 🔗 | `https://github.com` |
| 邮箱 | 📧 | `example@email.com` |
| 代码 | 💻 | `function hello() {}` |
| 颜色 | 🎨 | `#FF5733`, `rgb(255,0,0)` |
| 文件路径 | 📁 | `/home/user/file.txt` |
| 数字 | 🔢 | `12345` |

### 设置选项

点击侧边栏底部的「设置」按钮，可配置：

- **最大历史记录数**：100 - 10000 条
- **自动清理天数**：1 - 365 天
- **全局快捷键**：自定义呼出快捷键
- **主题模式**：浅色 / 深色 / 跟随系统
- **语言**：简体中文 / 繁體中文 / English

---

## 💡 设计思路与迭代规划

### 技术选型

- **Electron**：跨平台桌面应用框架
- **TypeScript**：类型安全，提升开发体验
- **原生剪贴板 API**：高效监听系统剪贴板变化
- **JSON 文件存储**：轻量级，无需额外数据库

### 架构设计

```
src/
├── main/           # 主进程
│   ├── index.ts    # 应用入口
│   ├── clipboard-store.ts  # 数据存储管理
│   └── preload.ts  # 预加载脚本
├── renderer/       # 渲染进程
│   ├── index.html  # UI 界面
│   ├── styles.css  # 样式
│   └── app.js      # 前端逻辑
└── shared/         # 共享模块
    ├── types.ts    # 类型定义
    └── utils.ts    # 工具函数
```

### 后续迭代计划

- [ ] 云同步功能
- [ ] 图片剪贴板支持
- [ ] 自定义标签系统
- [ ] 数据导出/导入
- [ ] 插件扩展机制

---

## 📦 打包与部署

### Windows

```bash
npm run dist
# 输出: release/Smart Clipboard Manager Setup 1.0.0.exe
```

### macOS

```bash
npm run dist
# 输出: release/Smart Clipboard Manager-1.0.0.dmg
```

### Linux

```bash
npm run dist
# 输出: release/Smart Clipboard Manager-1.0.0.AppImage
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

---

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

---

<a name="繁體中文"></a>
## 🎉 專案介紹

**Smart Clipboard Manager** 是一款功能強大的跨平台剪貼簿管理器，旨在解決日常工作和開發中剪貼簿歷史遺失、內容難以查找的痛點。

### 💡 靈感來源

在日常開發工作中，我們經常需要複製貼上多個程式碼片段、URL、顏色值等內容。然而系統預設的剪貼簿只能儲存最後一次複製的內容，導致之前的重要資訊遺失。本專案正是為了解決這一痛點而誕生。

### ✨ 自研差異化亮點

- **智慧內容識別**：自動識別 URL、郵件、程式碼、顏色值等多種內容類型
- **隱私保護**：自動偵測並排除密碼、API Key 等敏感內容
- **輕量級架構**：基於 Electron + TypeScript，記憶體佔用低
- **現代化 UI**：支援深色/淺色主題，介面簡潔美觀

---

## ✨ 核心特性

| 特性 | 描述 |
|------|------|
| 📋 **剪貼簿歷史** | 自動儲存最近 1000 條剪貼簿記錄 |
| 🔍 **智慧搜尋** | 支援全文搜尋和標籤篩選 |
| 🏷️ **自動分類** | 智慧識別 URL、郵件、程式碼、顏色等內容類型 |
| ⭐ **收藏功能** | 重要內容可收藏，方便快速存取 |
| 🔒 **隱私保護** | 自動排除密碼、Token 等敏感資訊 |
| 🎯 **去重機制** | 相同內容不會重複儲存 |
| ⌨️ **全域快捷鍵** | `Ctrl+Shift+V` 快速呼叫 |
| 🌙 **主題切換** | 支援淺色/深色/跟隨系統三種模式 |
| 🌐 **多語言支援** | 簡體中文、繁體中文、English |
| 🧹 **自動清理** | 支援按天數自動清理舊記錄 |

---

## 🚀 快速開始

### 環境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **作業系統**: Windows 10+ / macOS 10.14+ / Linux (Ubuntu 18.04+)

### 安裝步驟

```bash
# 克隆倉庫
git clone https://github.com/gitstq/smart-clipboard-manager.git

# 進入專案目錄
cd smart-clipboard-manager

# 安裝依賴
npm install

# 編譯 TypeScript
npm run build

# 啟動應用
npm run dev
```

---

## 📖 詳細使用指南

### 基礎操作

1. **呼叫應用**：按 `Ctrl+Shift+V`（可自訂）
2. **複製內容**：點擊任意歷史記錄即可複製到剪貼簿
3. **搜尋內容**：在搜尋框輸入關鍵詞，支援模糊匹配
4. **收藏項目**：點擊星標按鈕將常用內容加入收藏夾

---

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！請閱讀 [CONTRIBUTING.md](CONTRIBUTING.md) 了解詳細資訊。

---

## 📄 開源協議

本專案基於 [MIT](LICENSE) 協議開源。

---

<a name="english"></a>
## 🎉 Project Introduction

**Smart Clipboard Manager** is a powerful cross-platform clipboard manager designed to solve the pain points of clipboard history loss and difficult content retrieval in daily work and development.

### 💡 Inspiration

In daily development work, we often need to copy and paste multiple code snippets, URLs, color values, and other content. However, the system default clipboard can only save the last copied content, causing important previous information to be lost. This project was born to solve this pain point.

### ✨ Differentiation Highlights

- **Smart Content Recognition**: Automatically identifies URLs, emails, code, color values, and more
- **Privacy Protection**: Automatically detects and excludes passwords, API Keys, and other sensitive content
- **Lightweight Architecture**: Based on Electron + TypeScript with low memory footprint
- **Modern UI**: Supports dark/light themes with a clean and beautiful interface

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 📋 **Clipboard History** | Automatically saves the last 1000 clipboard records |
| 🔍 **Smart Search** | Full-text search and tag filtering support |
| 🏷️ **Auto-Categorization** | Intelligently identifies content types like URLs, emails, code, colors |
| ⭐ **Favorites** | Important content can be favorited for quick access |
| 🔒 **Privacy Protection** | Automatically excludes passwords, tokens, and other sensitive information |
| 🎯 **Deduplication** | Identical content won't be stored twice |
| ⌨️ **Global Hotkey** | `Ctrl+Shift+V` for quick access |
| 🌙 **Theme Switching** | Light / Dark / System theme support |
| 🌐 **Multi-language** | 简体中文, 繁體中文, English |
| 🧹 **Auto-Cleanup** | Automatic cleanup of old records by days |

---

## 🚀 Quick Start

### Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **OS**: Windows 10+ / macOS 10.14+ / Linux (Ubuntu 18.04+)

### Installation

```bash
# Clone the repository
git clone https://github.com/gitstq/smart-clipboard-manager.git

# Enter project directory
cd smart-clipboard-manager

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the app
npm run dev
```

### One-Click Run

```bash
# Development mode
npm run dev

# Production build
npm run dist

# Build for all platforms
npm run dist:all
```

---

## 📖 Detailed Usage Guide

### Basic Operations

1. **Open App**: Press `Ctrl+Shift+V` (customizable)
2. **Copy Content**: Click any history item to copy to clipboard
3. **Search Content**: Enter keywords in the search box with fuzzy matching
4. **Favorite Items**: Click the star button to add frequently used content to favorites

### Content Type Recognition

The app automatically recognizes the following content types:

| Type | Icon | Example |
|------|------|---------|
| URL | 🔗 | `https://github.com` |
| Email | 📧 | `example@email.com` |
| Code | 💻 | `function hello() {}` |
| Color | 🎨 | `#FF5733`, `rgb(255,0,0)` |
| File Path | 📁 | `/home/user/file.txt` |
| Number | 🔢 | `12345` |

### Settings

Click the "Settings" button at the bottom of the sidebar to configure:

- **Max History Items**: 100 - 10000
- **Auto Cleanup Days**: 1 - 365 days
- **Global Hotkey**: Customize the shortcut to open the app
- **Theme Mode**: Light / Dark / System
- **Language**: 简体中文 / 繁體中文 / English

---

## 💡 Design Philosophy & Roadmap

### Tech Stack

- **Electron**: Cross-platform desktop app framework
- **TypeScript**: Type-safe, enhanced development experience
- **Native Clipboard API**: Efficiently monitor system clipboard changes
- **JSON File Storage**: Lightweight, no additional database needed

### Architecture

```
src/
├── main/           # Main process
│   ├── index.ts    # App entry
│   ├── clipboard-store.ts  # Data storage management
│   └── preload.ts  # Preload script
├── renderer/       # Renderer process
│   ├── index.html  # UI interface
│   ├── styles.css  # Styles
│   └── app.js      # Frontend logic
└── shared/         # Shared modules
    ├── types.ts    # Type definitions
    └── utils.ts    # Utility functions
```

### Future Roadmap

- [ ] Cloud sync functionality
- [ ] Image clipboard support
- [ ] Custom tag system
- [ ] Data export/import
- [ ] Plugin extension mechanism

---

## 📦 Packaging & Deployment

### Windows

```bash
npm run dist
# Output: release/Smart Clipboard Manager Setup 1.0.0.exe
```

### macOS

```bash
npm run dist
# Output: release/Smart Clipboard Manager-1.0.0.dmg
```

### Linux

```bash
npm run dist
# Output: release/Smart Clipboard Manager-1.0.0.AppImage
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

<p align="center">
  Made with ❤️ by Smart Clipboard Team
</p>
