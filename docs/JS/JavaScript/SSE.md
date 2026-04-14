# SSE

> Server-Sent Events（服务器发送事件），是一种基于 HTTP 的**单向实时通信协议**，允许服务器通过 HTTP 响应将数据流推送到客户端。


## EventSource 原生 API
### 1. 基础用法
```javascript
// 建立连接
const es = new EventSource('/api/stream');

// 接收普通消息（onmessage）
es.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('收到:', data);
};

// 监听自定义事件
es.addEventListener('customEvent', (e) => {
  console.log('自定义事件:', e.data);
});

// 错误处理
es.onerror = (err) => {
  console.error('连接异常:', err);
};

// 主动关闭
// es.close();
```

### 2. 关键配置
- **URL**：连接地址
- **withCredentials**：支持跨域携带 Cookie（需服务端配合 CORS）
  ```javascript
  const es = new EventSource('/stream', { withCredentials: true });
  ```

### 3. 自动重连机制
- 连接断开后，默认会**自动重连**，重连间隔由服务器通过 `retry` 字段指定，或使用浏览器默认值（约 3 秒）。
- 服务端发送：
  ```
  retry: 5000\n\n  // 5秒后重连
  data: 消息内容\n\n
  ```

## fetch + eventsource-parser
### 核心优势
- 支持**自定义请求头**（如 Token 鉴权）
- 支持**POST 方法**（原生 EventSource 仅支持 GET）
- 流式解析，**内存占用可控**
- 跨环境通用（浏览器/Node.js）

### 1. 安装
```bash
npm install eventsource-parser
# 或
pnpm add eventsource-parser
```

### 2. 基础解析
```typescript
import { createParser } from 'eventsource-parser';

// 1. 创建解析器
const parser = createParser((event) => {
  if (event.type === 'event') {
    // 普通事件
    if (event.event === 'end') {
      console.log('✅ 推送完成');
    } else {
      console.log('📝 数据:', event.data);
    }
  }
});

// 2. 模拟喂入数据（实际从 fetch 流获取）
parser.feed('data: Hello SSE\n\n');
```

### 3. 完整流式解析（fetch）
```typescript
async function startStream() {
  const res = await fetch('/api/stream', {
    method: 'GET',
    headers: {
      Accept: 'text/event-stream',
      Authorization: 'Bearer token'
    }
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {
    if (event.type !== 'event') return;
    
    if (event.event === 'end') {
      console.log('✅ 完成');
      reader.cancel(); // 主动断开
    } else {
      const data = JSON.parse(event.data);
      console.log('📝', data);
    }
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    parser.feed(chunk);
  }
}
```

## axios 兼容方案
### 1. 浏览器端（onDownloadProgress）
```typescript
import axios from 'axios';
import { createParser } from 'eventsource-parser';

async function axiosSSE() {
  const parser = createParser((event) => {
    if (event.type !== 'event') return;
    console.log('数据:', event.data);
  });

  await axios({
    method: 'GET',
    url: '/api/stream',
    responseType: 'text',
    onDownloadProgress: (e) => {
      const chunk = e.currentTarget.responseText;
      parser.feed(chunk);
    }
  });
}
```

### 2. Node.js 端（stream 模式）
```typescript
import axios from 'axios';
import { createParser } from 'eventsource-parser';

async function nodeSSE() {
  const res = await axios({
    method: 'GET',
    url: '/api/stream',
    responseType: 'stream'
  });

  const stream = res.data;
  const parser = createParser((event) => {
    if (event.type !== 'event') return;
    console.log('数据:', event.data);
  });

  stream.on('data', (chunk) => {
    parser.feed(chunk.toString());
  });
}
```

## NestJS 后端实现
### 1. 基础 SSE 接口
```typescript
import { Controller, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

interface SseMessage {
  data: any;
  event?: string; // 自定义事件名
  retry?: number;  // 重连间隔
}

@Controller('sse')
export class SseController {
  @Sse('stream')
  stream(): Observable<SseMessage> {
    return interval(1000).pipe(
      map((i) => ({
        data: { count: i, msg: 'Hello SSE' },
        event: i === 9 ? 'end' : undefined, // 第10次发送结束事件
        retry: 3000
      }))
    );
  }
}
```

### 2. 日志推送实战（完成后主动断开）
```typescript
import { Controller, Sse } from '@nestjs/common';
import { Observable, concat, of, map } from 'rxjs';

@Controller('log')
export class LogController {
  @Sse('stream')
  sendLog(): Observable<{ data: string; event?: string }> {
    const logList = [
      '初始化成功',
      '连接数据库',
      '加载配置',
      '服务启动完成'
    ];

    return concat(
      ...logList.map((log, i) =>
        of({ data: JSON.stringify({ type: 'log', content: log }) }).pipe(map(x => x))
      ),
      // 结束事件
      of({
        event: 'end',
        data: JSON.stringify({ type: 'end', msg: '日志推送完成' })
      })
    );
  }
}
```

## 完整 Demo（日志推送 + 自动断开）
### 后端（NestJS）
```typescript
// log.controller.ts
import { Controller, Sse } from '@nestjs/common';
import { Observable, concat, of, map } from 'rxjs';

@Controller('log')
export class LogController {
  @Sse('stream')
  stream(): Observable<{ data: string; event?: string }> {
    const logs = [
      '[INFO] 服务启动中...',
      '[INFO] 数据库连接成功',
      '[WARN] 配置加载',
      '[ERROR] 接口超时',
      '[INFO] 初始化完成'
    ];

    return concat(
      ...logs.map((log, i) =>
        of({ data: JSON.stringify({ content: log }) }).pipe(map(x => x))
      ),
      of({ event: 'end', data: JSON.stringify({ msg: '完成' }) })
    );
  }
}
```

### 前端（fetch + eventsource-parser）
```typescript
import { createParser } from 'eventsource-parser';

async function startLogStream() {
  const res = await fetch('/log/stream', {
    method: 'GET',
    headers: { Accept: 'text/event-stream' }
  });

  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {
    if (event.type !== 'event') return;

    if (event.event === 'end') {
      const data = JSON.parse(event.data);
      console.log('✅', data.msg);
      reader.cancel();
    } else {
      const log = JSON.parse(event.data);
      console.log('📝', log.content);
    }
  });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.feed(decoder.decode(value, { stream: true }));
    }
  } finally {
    console.log('连接关闭');
  }
}

startLogStream();
```
##  fetch-event-source

### 安装

```bash
pnpm install @microsoft/fetch-event-source
```

###  基础用法（GET）

```javascript
import { fetchEventSource } from '@microsoft/fetch-event-source';

const ctrl = new AbortController();

fetchEventSource('/api/sse', {
  signal: ctrl.signal, // 用于中断
  openWhenHidden: true, // 页面隐藏也保持连接（默认false）

  // 连接成功回调（可校验响应）
  async onopen(response) {
    if (!response.ok) throw new Error('连接失败');
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/event-stream')) {
      throw new Error('非SSE流');
    }
  },

  // 接收消息（核心）
  onmessage(ev) {
    console.log('id:', ev.id);       // 事件ID
    console.log('event:', ev.event); // 事件类型（默认message）
    console.log('data:', ev.data);   // 数据（字符串）
    // const data = JSON.parse(ev.data);
  },

  // 错误与重试
  onerror(err) {
    console.error('SSE错误:', err);
    // 返回数字：重试间隔(ms)；返回null：停止重试
    return 5000; // 5秒后重试
  },

  // 连接关闭
  onclose() {
    console.log('SSE连接关闭');
  }
});

// 手动中断
// ctrl.abort();
```

###  带鉴权的 POST 请求（常用）
```javascript
import { fetchEventSource } from '@microsoft/fetch-event-source';

const token = localStorage.getItem('token');

fetchEventSource('/api/sse/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ✅ 支持请求头鉴权
  },
  body: JSON.stringify({
    prompt: '你好' // ✅ 支持请求体传参
  }),

  onmessage(ev) {
    // 处理流式数据（如AI打字机效果）
    console.log(ev.data);
  }
});
```

###  消息对象结构（ev）
```typescript
interface EventSourceMessage {
  id: string;      // last-event-id
  event: string;   // 事件类型（自定义）
  data: string;    // 数据体
  retry?: number;  // 重试间隔（服务端指定）
}
```

###  错误处理与重试（推荐）
```javascript
class FatalError extends Error {} // 致命错误（不重试）
class RetriableError extends Error {} // 可重试

fetchEventSource('/api/sse', {
  async onopen(response) {
    if (response.status === 401) throw new FatalError('未授权');
    if (response.status === 429) throw new RetriableError('限流');
    if (!response.ok) throw new Error('服务器错误');
  },

  onerror(err) {
    if (err instanceof FatalError) {
      console.log('鉴权失败，停止重试');
      return null; // 不重试
    }
    console.log('可重试错误，3秒后重连');
    return 3000;
  }
});
```