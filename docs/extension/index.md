# 浏览器插件

::: info

- **manifest.json**：配置文件，定义插件的基本信息和权限
- **Content Scripts**：在网页中运行的脚本，可以访问和修改网页内容
- **Background Scripts**：在后台运行的脚本，处理事件和持久化数据
- **Popup**：点击插件图标时显示的弹出页面
- **Options Page**：插件设置页面
- **Icons**：插件图标
  :::

## manifest.json

### Manifest V3

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "浏览器插件描述",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "permissions": ["storage", "tabs", "activeTab"],
  "host_permissions": ["https://*/*", "http://*/*"]
}
```

### 常用配置项

| 配置项             | 说明                |
| ------------------ | ------------------- |
| `manifest_version` | 清单版本，V3 为最新 |
| `name`             | 插件名称            |
| `version`          | 版本号              |
| `description`      | 插件描述            |
| `icons`            | 插件图标            |
| `action`           | 工具栏按钮配置      |
| `background`       | 后台脚本配置        |
| `content_scripts`  | 内容脚本配置        |
| `permissions`      | 权限声明            |
| `host_permissions` | 主机权限            |

## Content Scripts

### 基本使用

```javascript
// content.js

// 访问DOM
const title = document.querySelector('h1').textContent;

// 修改页面内容
document.body.style.backgroundColor = '#f0f0f0';

// 监听页面事件
document.addEventListener('click', e => {
  console.log('点击了:', e.target);
});

// 向background发送消息
chrome.runtime.sendMessage({
  type: 'pageData',
  data: { title, url: window.location.href },
});

// 接收来自background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'highlight') {
    highlightText(request.text);
  }
});
```

### 注入时机

| run_at 值        | 说明                       |
| ---------------- | -------------------------- |
| `document_start` | CSS 加载后，DOM 构建前     |
| `document_end`   | DOM 构建完成，资源加载前   |
| `document_idle`  | 浏览器选择最佳时机（默认） |

### 匹配模式

```json
{
  "matches": [
    "<all_urls>", // 所有网页
    "https://*/*", // 所有HTTPS网站
    "http://*.example.com/*", // 特定域名
    "file:///*", // 本地文件
    "https://example.com/*" // 特定网站
  ]
}
```

## Background Scripts

### Service Worker（V3）

```javascript
// background.js

// 监听插件安装
chrome.runtime.onInstalled.addListener(() => {
  console.log('插件已安装');

  // 设置默认值
  chrome.storage.local.set({
    settings: {
      enabled: true,
      theme: 'light',
    },
  });
});

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'pageData') {
    console.log('收到页面数据:', request.data);
    sendResponse({ status: 'success' });
  }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('页面加载完成:', tab.url);
  }
});

// 监听命令
chrome.commands.onCommand.addListener(command => {
  if (command === 'toggle-feature') {
    toggleFeature();
  }
});

// 存储数据
async function saveData(key, value) {
  await chrome.storage.local.set({ [key]: value });
}

// 读取数据
async function loadData(key) {
  const result = await chrome.storage.local.get(key);
  return result[key];
}
```

## Popup

### HTML 结构

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        width: 300px;
        padding: 10px;
      }
      button {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <h3>我的插件</h3>
    <button id="actionBtn">执行操作</button>
    <button id="settingsBtn">打开设置</button>
    <script src="popup.js"></script>
  </body>
</html>
```

### JavaScript 逻辑

```javascript
// popup.js

document.getElementById('actionBtn').addEventListener('click', async () => {
  // 获取当前标签页
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 向content script发送消息
  chrome.tabs.sendMessage(tab.id, {
    type: 'executeAction',
  });
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  // 打开设置页面
  chrome.runtime.openOptionsPage();
});

// 加载设置
chrome.storage.local.get(['settings'], result => {
  if (result.settings) {
    console.log('设置:', result.settings);
  }
});
```

## 常用 API

### Storage API

```javascript
// 保存数据
chrome.storage.local.set({ key: 'value' });

// 读取数据
chrome.storage.local.get(['key'], result => {
  console.log(result.key);
});

// 删除数据
chrome.storage.local.remove(['key']);

// 清空所有数据
chrome.storage.local.clear();

// 监听数据变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.key) {
    console.log('数据已变化:', changes.key.newValue);
  }
});
```

### Tabs API

```javascript
// 获取当前标签页
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  console.log(tabs[0]);
});

// 创建新标签页
chrome.tabs.create({ url: 'https://example.com' });

// 更新标签页
chrome.tabs.update(tabId, { url: 'https://newurl.com' });

// 关闭标签页
chrome.tabs.remove(tabId);

// 向标签页注入脚本
chrome.tabs.executeScript(tabId, {
  code: 'document.body.style.backgroundColor = "red"',
});
```

### Runtime API

```javascript
// 获取插件ID
chrome.runtime.id;

// 获取插件URL
chrome.runtime.getURL('icon.png');

// 发送消息
chrome.runtime.sendMessage({ type: 'ping' }, response => {
  console.log(response);
});

// 监听消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ status: 'received' });
});
```

### Notifications API

```javascript
// 显示通知
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icon.png',
  title: '通知标题',
  message: '通知内容',
});

// 监听通知点击
chrome.notifications.onClicked.addListener(notificationId => {
  console.log('通知被点击:', notificationId);
});
```

## 权限说明

### 常用权限

| 权限            | 说明               |
| --------------- | ------------------ |
| `storage`       | 访问存储 API       |
| `tabs`          | 访问标签页信息     |
| `activeTab`     | 访问当前活动标签页 |
| `scripting`     | 动态注入脚本       |
| `notifications` | 显示通知           |
| `bookmarks`     | 访问书签           |
| `history`       | 访问浏览历史       |
| `downloads`     | 管理下载           |
| `cookies`       | 访问 Cookie        |

### Host Permissions

```json
{
  "host_permissions": ["https://*.google.com/*", "http://localhost:*/*"]
}
```

## 开发工具

### Plasmo

[Plasmo](https://plasmo.com/) 是一个现代化的浏览器插件开发框架，支持 React、TypeScript 等。

#### 安装

```bash
npm create plasmo
cd my-extension
npm install
npm run dev
```

#### 项目结构

```
my-extension/
├── package.json
├── plasmo.config.ts
├── src/
│   ├── popup.tsx
│   ├── content.tsx
│   ├── background.ts
│   └── options.tsx
└── assets/
    └── icon.png
```

#### 示例代码

```typescript
// src/content.tsx
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

export default function ContentScript() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'white',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      Hello from Content Script!
    </div>
  );
}
```

### Chrome Extensions CLI

```bash
npm install -g chrome-extension-cli
chrome-extension-cli my-extension
```

## 调试

### 加载插件

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择插件目录

### 查看日志

- **Content Script**：在网页控制台查看
- **Background Script**：在扩展程序页面点击"service worker"查看
- **Popup**：右键点击 popup 选择"检查"

### 热重载

修改代码后，在扩展程序页面点击刷新按钮即可。

## 打包发布

### 打包

```bash
# 使用Plasmo
npm run build

# 手动打包
# 将插件文件夹压缩为zip文件
```

### 发布到 Chrome Web Store

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 上传 zip 文件
3. 填写商店信息
4. 提交审核

## 最佳实践

### 1. 使用 Manifest V3

V3 是最新版本，提供更好的安全性和性能。

### 2. 最小化权限

只申请必要的权限，提高用户信任度。

### 3. 使用 Content Security Policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### 4. 异步编程

使用 Promise 和 async/await 处理异步操作。

### 5. 错误处理

```javascript
try {
  const result = await chrome.storage.local.get('key');
} catch (error) {
  console.error('操作失败:', error);
}
```

## 常见问题

### Content Script 无法访问页面变量

Content Script 运行在隔离的环境中，无法直接访问页面的 JavaScript 变量。需要通过`window.postMessage`通信。

### Background Script 无法访问 DOM

Background Script 运行在独立的环境中，无法直接访问页面 DOM。需要通过 Content Script 操作。

### 跨域问题

需要在`host_permissions`中声明目标域名。

## 参考资源

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [MDN Web Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Plasmo Documentation](https://docs.plasmo.com/)
