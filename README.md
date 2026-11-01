<div align="center">
  <h1>GitHUB-simple-ZH</h1>

  [![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)
  [![Tampermonkey](https://img.shields.io/badge/Requires-Tampermonkey-green)](https://www.tampermonkey.net/)
  [![Release](https://img.shields.io/github/v/release/shen136/github-simple-zh?color=green)](https://github.com/shen136/github-simple-zh/releases)

  <p>一个轻量、纯本地的 GitHub 界面中文化油猴脚本。无需调用任何第三方翻译 API，安全、极速。</p>
</div>

---

## ✨ 特性

- 🚀 **纯本地词典**：没有任何外部网络请求，告别机翻，极速响应。
- 🛡️ **精准保护**：绝不翻译代码块 (`<code>`)、Markdown 文档 (README)、Issue 正文、以及用户的提交记录 (Commits) 和文件名。
- 🌐 **动态支持**：完美兼容 GitHub 的 SPA 页面切换（Turbo/PJAX）与 Shadow DOM 组件。
- 🔄 **持续扩展**：支持长词组精确匹配，避免出现中英混杂的“半成品”翻译；支持 `placeholder` 输入框占位符翻译。

## 📦 安装方法

1. **安装管理器**：确保你的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/) 插件。
2. **安装脚本**：点击下方链接进行一键安装：
   
   👉 **[点击这里一键安装 (推荐线路)](https://gcore.jsdelivr.net/gh/shen136/github-simple-zh@main/github-simple-zh.user.js)**  
   *(如果上述链接无法访问，请尝试 [备用线路](https://fastly.jsdelivr.net/gh/shen136/github-simple-zh@main/github-simple-zh.user.js))*

3. 刷新 GitHub 页面，即可体验中文界面。

## ⚙️ 自定义词典

如果你发现有未翻译的固定 UI 词汇，或者想修改某些词汇的翻译，可以直接编辑脚本源码中的 `DICT` 字典对象：

```javascript
const DICT = {
    'Pull requests': '拉取请求',
    'New codespace': '新建代码空间',
    // 在这里添加你的自定义词条...
    'Your Custom Text': '你的自定义翻译'
};