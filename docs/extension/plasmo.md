# Plasmo

> Plasmo 是一个现代化的浏览器插件开发框架，支持 React、TypeScript、Tailwind CSS 等现代技术栈，大大简化了插件开发流程。

## 特性

- 🚀 **零配置**：开箱即用，无需复杂配置
- ⚛️ **React 支持**：使用 React 组件开发插件
- 🖖 **Vue 支持**：使用 Vue 3 组件开发插件
- 📘 **TypeScript**：完整的类型支持
- 🎨 **Tailwind CSS**：内置样式支持
- 🔄 **热重载**：开发时自动刷新
- 📦 **模块化**：支持 npm 包管理
- 🔧 **自动打包**：自动生成 manifest.json

## 快速开始

### 安装

```bash
# 使用 pnpm
pnpm create plasmo
```

### 项目结构

```
my-extension/
├── package.json
├── plasmo.config.ts
├── tsconfig.json
├── .gitignore
├── src/
│   ├── popup.tsx              # Popup 页面
│   ├── options.tsx            # 选项页面
│   ├── background.ts          # 后台脚本
│   ├── content.tsx            # 内容脚本
│   ├── content-scripts/       # 多个内容脚本
│   │   ├── style.css
│   │   └── index.tsx
│   └── injected-content.tsx   # 注入内容脚本
├── assets/
│   └── icon.png
└── build/                    # 构建输出
```

## 配置文件

### plasmo.config.ts

```typescript
import type { PlasmoConfig } from 'plasmo';

const config: PlasmoConfig = {
  srcDir: 'src',
  build: {
    manifest: {
      name: 'My Extension',
      description: 'My awesome extension',
      version: '1.0.0',
      permissions: ['storage', 'tabs'],
      host_permissions: ['https://*/*'],
    },
  },
};

export default config;
```

## 核心组件

### 1. Popup

Popup 是点击插件图标时显示的弹出页面。

```typescript
// src/popup.tsx
import { useState, useEffect } from 'react';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

function IndexPopup() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    storage.get('count').then(value => {
      setCount((value as number) || 0);
    });
  }, []);

  const increment = async () => {
    const newCount = count + 1;
    setCount(newCount);
    await storage.set('count', newCount);
  };

  return (
    <div
      style={{
        width: '300px',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '16px' }}>My Extension</h1>
      <p>Count: {count}</p>
      <button
        onClick={increment}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Increment
      </button>
    </div>
  );
}

export default IndexPopup;
```

### 2. Content Script

Content Script 在网页中运行，可以访问和修改页面内容。

```typescript
// src/content.tsx
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  all_frames: true,
  run_at: 'document_end',
};

export default function ContentScript() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: '9999',
      }}
    >
      <h3>Hello from Content Script!</h3>
      <p>Current URL: {window.location.href}</p>
    </div>
  );
}
```

### 3. Background Script

Background Script 在后台运行，处理事件和持久化数据。

```typescript
// src/background.ts
import type { PlasmoBackgroundConfig } from 'plasmo';

export const config: PlasmoBackgroundConfig = {
  persistent: true,
};

const storage = new Storage();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  storage.set({
    settings: {
      enabled: true,
      theme: 'light',
    },
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Page loaded:', tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getData') {
    storage.get('settings').then(settings => {
      sendResponse(settings);
    });
  }
  return true;
});
```

### 4. Options Page

Options Page 是插件的设置页面。

```typescript
// src/options.tsx
import { useState, useEffect } from 'react';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

function Options() {
  const [settings, setSettings] = useState({
    enabled: true,
    theme: 'light',
  });

  useEffect(() => {
    storage.get('settings').then(value => {
      if (value) {
        setSettings(value as any);
      }
    });
  }, []);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.set('settings', newSettings);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h1>Extension Settings</h1>

      <div style={{ marginBottom: '16px' }}>
        <label>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={e => handleChange('enabled', e.target.checked)}
          />
          Enable Extension
        </label>
      </div>

      <div>
        <label>
          Theme:
          <select
            value={settings.theme}
            onChange={e => handleChange('theme', e.target.value)}
            style={{ marginLeft: '8px' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default Options;
```

## 高级功能

### 0. 使用 Vue

Plasmo 支持 Vue 3，可以使用 Vue 的组合式 API 和单文件组件（SFC）开发插件。

#### 安装 Vue 依赖

```bash
npm install vue @vitejs/plugin-vue
```

#### 配置 Plasmo 支持 Vue

```typescript
// plasmo.config.ts
import type { PlasmoConfig } from 'plasmo';
import vue from '@vitejs/plugin-vue';

const config: PlasmoConfig = {
  srcDir: 'src',
  build: {
    manifest: {
      name: 'My Extension',
      description: 'My awesome extension',
      version: '1.0.0',
      permissions: ['storage', 'tabs'],
      host_permissions: ['https://*/*'],
    },
    vite: {
      plugins: [vue()],
    },
  },
};

export default config;
```

#### Vue Popup 组件

```vue
<!-- src/popup.vue -->
<template>
  <div class="popup-container">
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

const title = ref('My Vue Extension');
const count = ref(0);

onMounted(async () => {
  const value = await storage.get('count');
  count.value = (value as number) || 0;
});

const increment = async () => {
  count.value++;
  await storage.set('count', count.value);
};
</script>

<style scoped>
.popup-container {
  width: 300px;
  padding: 16px;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 16px;
}

button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

#### Vue Content Script

```vue
<!-- src/content.vue -->
<template>
  <div class="content-widget">
    <h3>Hello from Vue Content Script!</h3>
    <p>Current URL: {{ currentUrl }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  all_frames: true,
  run_at: 'document_end',
};

const currentUrl = ref(window.location.href);
</script>

<style scoped>
.content-widget {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}
</style>
```

#### Vue Options Page

```vue
<!-- src/options.vue -->
<template>
  <div class="options-container">
    <h1>Extension Settings</h1>

    <div class="setting-item">
      <label>
        <input
          type="checkbox"
          v-model="settings.enabled"
          @change="saveSettings"
        />
        Enable Extension
      </label>
    </div>

    <div class="setting-item">
      <label>
        Theme:
        <select v-model="settings.theme" @change="saveSettings">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

const settings = reactive({
  enabled: true,
  theme: 'light',
});

onMounted(async () => {
  const value = await storage.get('settings');
  if (value) {
    Object.assign(settings, value);
  }
});

const saveSettings = async () => {
  await storage.set('settings', settings);
};
</script>

<style scoped>
.options-container {
  padding: 24px;
  max-width: 600px;
}

.setting-item {
  margin-bottom: 16px;
}

select {
  margin-left: 8px;
}
</style>
```

#### Vue Background Script

```typescript
// src/background.ts
import type { PlasmoBackgroundConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';

export const config: PlasmoBackgroundConfig = {
  persistent: true,
};

const storage = new Storage();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  storage.set({
    settings: {
      enabled: true,
      theme: 'light',
    },
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Page loaded:', tab.url);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getData') {
    storage.get('settings').then(settings => {
      sendResponse(settings);
    });
  }
  return true;
});
```

#### Vue 组件中使用 Storage

```vue
<template>
  <div>
    <p>Value: {{ data }}</p>
    <button @click="updateData">Update</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Storage } from '@plasmohq/storage';

const storage = new Storage();
const data = ref('');

onMounted(async () => {
  const value = await storage.get('key');
  data.value = (value as string) || '';
});

const updateData = async () => {
  const newValue = 'Updated at ' + new Date().toISOString();
  data.value = newValue;
  await storage.set('key', newValue);
};

// 监听存储变化
storage.watch({
  key: newValue => {
    data.value = newValue as string;
  },
});
</script>
```

### 1. 多个 Content Script

```typescript
// src/content-scripts/home.tsx
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://www.google.com/*'],
};

export default function HomeContentScript() {
  return <div>Google Page Script</div>;
}
```

```typescript
// src/content-scripts/youtube.tsx
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://www.youtube.com/*'],
};

export default function YouTubeContentScript() {
  return <div>YouTube Page Script</div>;
}
```

### 2. 注入 Content Script

注入脚本可以访问页面的 JavaScript 上下文。

```typescript
// src/injected-content.tsx
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
};

export default function InjectedContent() {
  console.log('Injected into page context');
  console.log('Page variables:', window.someVariable);
  return null;
}
```

### 3. 消息传递

#### Popup 到 Content Script

```typescript
// popup.tsx
const sendMessage = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'highlight',
      text: 'Hello',
    });
  }
};
```

```typescript
// content.tsx
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'highlight') {
    console.log('Highlight:', request.text);
  }
});
```

#### Content Script 到 Background

```typescript
// content.tsx
chrome.runtime.sendMessage({
  type: 'saveData',
  data: { key: 'value' },
});
```

```typescript
// background.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'saveData') {
    storage.set('data', request.data);
  }
});
```

### 4. Storage API

Plasmo 提供了更友好的 Storage API。

```typescript
import { Storage } from '@plasmohq/storage';

const storage = new Storage();

// 保存数据
await storage.set('key', 'value');

// 读取数据
const value = await storage.get('key');

// 监听变化
storage.watch({
  key: newValue => {
    console.log('Key changed:', newValue);
  },
});

// 删除数据
await storage.remove('key');

// 清空所有数据
await storage.clear();
```

### 5. 使用 CSS

#### 内联样式

```typescript
// src/popup.tsx
export default function Popup() {
  return (
    <div style={{ padding: '16px' }}>
      <h1>Hello</h1>
    </div>
  );
}
```

#### CSS 模块

```css
/* src/style.css */
.container {
  padding: 16px;
  background: white;
}

.title {
  font-size: 24px;
  color: #333;
}
```

```typescript
// src/popup.tsx
import styles from './style.css';

export default function Popup() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
}
```

#### Tailwind CSS

```typescript
// src/popup.tsx
export default function Popup() {
  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl text-gray-800">Hello</h1>
    </div>
  );
}
```

### 6. 使用图标

```typescript
// src/popup.tsx
import { useState } from 'react';

function Icon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
      />
    </svg>
  );
}

export default function Popup() {
  return (
    <div>
      <Icon />
    </div>
  );
}
```

## 开发命令

```bash
# 开发模式（支持热重载）
npm run dev

# 构建生产版本
npm run build

# 打包扩展
npm run package

# 清理构建文件
npm run clean
```

## 调试

### 1. 加载扩展

1. 运行 `npm run dev`
2. 打开 Chrome 浏览器
3. 访问 `chrome://extensions/`
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择 `build/chrome-mv3-dev` 文件夹

### 2. 查看日志

- **Popup**：右键点击 popup，选择"检查"
- **Content Script**：在网页控制台查看
- **Background**：在扩展程序页面点击"service worker"

### 3. 热重载

修改代码后，扩展会自动刷新。如果没有自动刷新，可以在扩展程序页面点击刷新按钮。

## 发布

### 1. 构建

```bash
npm run build
```

构建完成后，在 `build/chrome-mv3-prod` 文件夹中找到打包好的扩展。

### 2. 打包

将 `build/chrome-mv3-prod` 文件夹压缩为 zip 文件。

### 3. 发布到 Chrome Web Store

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 上传 zip 文件
3. 填写商店信息（名称、描述、截图等）
4. 设置价格和分发区域
5. 提交审核

### 4. 发布到其他浏览器

- **Firefox**：访问 [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
- **Edge**：访问 [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard)
- **Safari**：使用 Xcode 打包并发布

## 最佳实践

### 1. 使用 TypeScript

充分利用 TypeScript 的类型检查，减少运行时错误。

```typescript
interface Settings {
  enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

const settings: Settings = {
  enabled: true,
  theme: 'light',
  notifications: false,
};
```

### 2. 组件化开发

将功能拆分为可复用的组件。

```typescript
// components/Button.tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
```

### 3. 错误处理

```typescript
try {
  const data = await storage.get('key');
} catch (error) {
  console.error('Failed to load data:', error);
}
```

### 4. 性能优化

```typescript
// 使用 React.memo 避免不必要的重渲染
export default React.memo(function ContentScript() {
  return <div>Content</div>;
});

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props.data);
}, [props.data]);
```

### 5. 权限最小化

只在 `plasmo.config.ts` 中声明必要的权限。

```typescript
const config: PlasmoConfig = {
  build: {
    manifest: {
      permissions: ['storage'], // 只申请必要的权限
      host_permissions: ['https://example.com/*'], // 只访问需要的域名
    },
  },
};
```

## 常见问题

### 1. 热重载不工作

确保在开发模式下运行 `npm run dev`，并且正确加载了 `build/chrome-mv3-dev` 文件夹。

### 2. Content Script 样式冲突

使用 CSS Modules 或 scoped CSS 避免样式冲突。

### 3. 消息传递失败

确保消息发送和接收的代码都在正确的上下文中运行，并且正确处理了异步操作。

### 4. Storage 数据丢失

使用 `chrome.storage.local` 而不是 `chrome.storage.session` 来持久化数据。

## 参考资源

- [Plasmo 官方文档](https://docs.plasmo.com/)
- [Plasmo GitHub](https://github.com/PlasmoHQ/plasmo)
- [Plasmo 示例项目](https://github.com/PlasmoHQ/examples)
- [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)
