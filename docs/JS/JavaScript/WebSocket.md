# WebSocket
## 一、WebSocket 核心概念
### 1. 定义
WebSocket 是一种**基于TCP的全双工、长连接通信协议**，依托HTTP/HTTPS完成握手后，建立持久连接，实现客户端与服务端双向实时数据传输，解决了HTTP协议单向请求、无状态、短连接的实时性短板。

### 2. 核心特点
- **全双工通信**：客户端和服务端可同时主动发送/接收数据，无需等待请求响应
- **持久连接**：一次握手后保持长连接，减少重复握手开销，降低资源消耗
- **轻量级协议**：数据帧头部短小，传输效率远高于HTTP轮询
- **兼容跨域**：支持跨域通信，需服务端配置跨域权限
- **支持文本/二进制数据**：可传输字符串、JSON、图片、文件等多种数据格式

### 3. 协议标识
- 普通连接：`ws://` （对应HTTP）
- 加密连接：`wss://` （对应HTTPS，生产环境必用）

### 4. 适用场景
实时聊天、在线协作、直播弹幕、游戏同步、实时数据监控、消息推送等强实时性场景。

## 二、前端原生 WebSocket 使用
### 1. 基础用法
```javascript
// 1. 创建WebSocket连接
const socket = new WebSocket('ws://localhost:3000/websocket');

// 2. 连接成功回调
socket.onopen = () => {
  console.log('WebSocket连接建立成功');
  // 向服务端发送数据
  socket.send(JSON.stringify({ type: 'init', msg: '客户端上线' }));
};

// 3. 接收服务端消息
socket.onmessage = (event) => {
  const resData = JSON.parse(event.data);
  console.log('收到服务端消息：', resData);
};

// 4. 连接异常回调
socket.onerror = (error) => {
  console.error('WebSocket连接异常：', error);
};

// 5. 连接关闭回调
socket.onclose = (event) => {
  console.log('WebSocket连接关闭：', event.code, event.reason);
};

// 主动关闭连接
// socket.close(1000, '主动断开连接');
```

### 2. 关键API说明
- `WebSocket(url)`：创建连接，传入服务端WebSocket地址
- `send(data)`：向服务端发送数据，仅支持字符串/Blob/ArrayBuffer
- `close(code, reason)`：关闭连接，code为关闭状态码（1000表示正常关闭），reason为关闭原因
- 监听事件：`open`/`message`/`error`/`close`，也可使用`addEventListener`绑定

### 3. 重连机制（断线自动重连）
```javascript
let socket = null;
let reconnectTimer = null;
const reconnectDelay = 3000; // 重连间隔3秒

// 封装连接函数
function createSocket() {
  socket = new WebSocket('ws://localhost:3000/websocket');

  socket.onopen = () => {
    console.log('连接成功');
    clearTimeout(reconnectTimer);
  };

  socket.onclose = (event) => {
    console.log('连接断开，尝试重连');
    // 非正常关闭时触发重连
    if (event.code !== 1000) {
      reconnectTimer = setTimeout(createSocket, reconnectDelay);
    }
  };

  socket.onerror = (err) => {
    console.error('连接异常', err);
    socket.close();
  };
}

// 初始化连接
createSocket();
```

## 三、NestJS 后端 WebSocket 实现
NestJS 内置`@nestjs/websockets`和`@nestjs/platform-socket.io`，支持原生WebSocket和Socket.IO，这里演示**原生WebSocket**实现。

### 1. 安装依赖
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io ws
```

### 2. 创建WebSocket网关
```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

// 配置WebSocket网关，指定路径
@WebSocketGateway({ path: '/websocket', cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // 获取WebSocket服务端实例
  @WebSocketServer()
  server: Server;

  // 客户端连接成功触发
  handleConnection(client: WebSocket) {
    console.log('新客户端连接');
    // 向当前客户端发送消息
    client.send(JSON.stringify({ type: 'connect', msg: '连接成功' }));
  }

  // 客户端断开连接触发
  handleDisconnect(client: WebSocket) {
    console.log('客户端断开连接');
  }

  // 监听客户端发送的消息
  @SubscribeMessage('clientMsg')
  handleClientMsg(client: WebSocket, data: any) {
    console.log('收到客户端消息：', data);
    // 广播消息给所有客户端
    this.server.clients.forEach((item) => {
      if (item.readyState === WebSocket.OPEN) {
        item.send(JSON.stringify({ type: 'broadcast', data }));
      }
    });
  }
}
```

### 3. 注册网关到模块
```typescript
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
```

## 四、Socket.IO 简化使用（推荐）
原生WebSocket无重连、房间、广播等高级功能，实际开发常用**Socket.IO**（基于WebSocket封装的库，兼容低版本浏览器，自带重连、房间、命名空间等功能）。

### 1. 前端Socket.IO
```bash
npm install socket.io-client
```
```javascript
import { io } from 'socket.io-client';

// 连接
const socket = io('http://localhost:3000', {
  transports: ['websocket'], // 强制使用WebSocket
});

// 连接成功
socket.on('connect', () => {
  console.log('连接成功');
  // 发送消息
  socket.emit('clientMsg', { msg: 'Hello Socket.IO' });
});

// 接收服务端消息
socket.on('serverMsg', (data) => {
  console.log(data);
});

// 断开连接
socket.on('disconnect', () => {
  console.log('连接断开');
});
```

### 2. NestJS Socket.IO 网关
```typescript
import { WebSocketGateway, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketIoGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    console.log('客户端连接：', client.id);
  }

  @SubscribeMessage('clientMsg')
  handleMessage(client: Socket, data: any) {
    // 广播给所有客户端
    client.broadcast.emit('serverMsg', data);
    // 给当前客户端发送消息
    client.emit('serverMsg', { msg: '消息已收到' });
  }
}
```

## 五、WebSocket 与 HTTP、SSE 对比
| 特性 | WebSocket | HTTP | SSE |
|------|-----------|------|-----|
| 通信方式 | 全双工 | 单向请求-响应 | 服务端→客户端单向 |
| 连接类型 | 长连接 | 短连接/长连接 | 长连接 |
| 数据格式 | 文本/二进制 | 文本/二进制 | 纯文本 |
| 自动重连 | 不支持（需手动） | 无 | 支持 |
| 适用场景 | 强实时双向通信 | 常规数据请求 | 单向实时推送 |
| 性能开销 | 低 | 高（轮询） | 中 |

## 六、常见问题与优化
1. **生产环境必须用wss://**：避免数据被窃取、篡改，兼容HTTPS页面
2. **心跳机制**：定时发送心跳包，避免连接被代理服务器断开
3. **连接限流**：服务端限制单IP连接数，防止恶意请求
4. **数据校验**：接收数据时做格式校验，防止非法数据
5. **异常处理**：完善重连、错误捕获机制，提升稳定性
6. **Nginx代理配置**：
```nginx
location /websocket {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_connect_timeout 60s;
    proxy_read_timeout 86400s;
}
```
# WebSocket
## 一、WebSocket 核心概念
### 1. 定义
WebSocket 是一种**基于TCP的全双工、长连接通信协议**，依托HTTP/HTTPS完成握手后，建立持久连接，实现客户端与服务端双向实时数据传输，解决了HTTP协议单向请求、无状态、短连接的实时性短板。

### 2. 核心特点
- **全双工通信**：客户端和服务端可同时主动发送/接收数据，无需等待请求响应
- **持久连接**：一次握手后保持长连接，减少重复握手开销，降低资源消耗
- **轻量级协议**：数据帧头部短小，传输效率远高于HTTP轮询
- **兼容跨域**：支持跨域通信，需服务端配置跨域权限
- **支持文本/二进制数据**：可传输字符串、JSON、图片、文件等多种数据格式

### 3. 协议标识
- 普通连接：`ws://` （对应HTTP）
- 加密连接：`wss://` （对应HTTPS，生产环境必用）

### 4. 适用场景
实时聊天、在线协作、直播弹幕、游戏同步、实时数据监控、消息推送等强实时性场景。

## 二、前端原生 WebSocket 使用
### 1. 基础用法
```javascript
// 1. 创建WebSocket连接
const socket = new WebSocket('ws://localhost:3000/websocket');

// 2. 连接成功回调
socket.onopen = () => {
  console.log('WebSocket连接建立成功');
  // 向服务端发送数据
  socket.send(JSON.stringify({ type: 'init', msg: '客户端上线' }));
};

// 3. 接收服务端消息
socket.onmessage = (event) => {
  const resData = JSON.parse(event.data);
  console.log('收到服务端消息：', resData);
};

// 4. 连接异常回调
socket.onerror = (error) => {
  console.error('WebSocket连接异常：', error);
};

// 5. 连接关闭回调
socket.onclose = (event) => {
  console.log('WebSocket连接关闭：', event.code, event.reason);
};

// 主动关闭连接
// socket.close(1000, '主动断开连接');
```

### 2. 关键API说明
- `WebSocket(url)`：创建连接，传入服务端WebSocket地址
- `send(data)`：向服务端发送数据，仅支持字符串/Blob/ArrayBuffer
- `close(code, reason)`：关闭连接，code为关闭状态码（1000表示正常关闭），reason为关闭原因
- 监听事件：`open`/`message`/`error`/`close`，也可使用`addEventListener`绑定

### 3. 重连机制（断线自动重连）
```javascript
let socket = null;
let reconnectTimer = null;
const reconnectDelay = 3000; // 重连间隔3秒

// 封装连接函数
function createSocket() {
  socket = new WebSocket('ws://localhost:3000/websocket');

  socket.onopen = () => {
    console.log('连接成功');
    clearTimeout(reconnectTimer);
  };

  socket.onclose = (event) => {
    console.log('连接断开，尝试重连');
    // 非正常关闭时触发重连
    if (event.code !== 1000) {
      reconnectTimer = setTimeout(createSocket, reconnectDelay);
    }
  };

  socket.onerror = (err) => {
    console.error('连接异常', err);
    socket.close();
  };
}

// 初始化连接
createSocket();
```

## 三、NestJS 后端 WebSocket 实现
NestJS 内置`@nestjs/websockets`和`@nestjs/platform-socket.io`，支持原生WebSocket和Socket.IO，这里演示**原生WebSocket**实现。

### 1. 安装依赖
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io ws
```

### 2. 创建WebSocket网关
```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

// 配置WebSocket网关，指定路径
@WebSocketGateway({ path: '/websocket', cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // 获取WebSocket服务端实例
  @WebSocketServer()
  server: Server;

  // 客户端连接成功触发
  handleConnection(client: WebSocket) {
    console.log('新客户端连接');
    // 向当前客户端发送消息
    client.send(JSON.stringify({ type: 'connect', msg: '连接成功' }));
  }

  // 客户端断开连接触发
  handleDisconnect(client: WebSocket) {
    console.log('客户端断开连接');
  }

  // 监听客户端发送的消息
  @SubscribeMessage('clientMsg')
  handleClientMsg(client: WebSocket, data: any) {
    console.log('收到客户端消息：', data);
    // 广播消息给所有客户端
    this.server.clients.forEach((item) => {
      if (item.readyState === WebSocket.OPEN) {
        item.send(JSON.stringify({ type: 'broadcast', data }));
      }
    });
  }
}
```

### 3. 注册网关到模块
```typescript
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
```

## 四、Socket.IO 简化使用（推荐）
原生WebSocket无重连、房间、广播等高级功能，实际开发常用**Socket.IO**（基于WebSocket封装的库，兼容低版本浏览器，自带重连、房间、命名空间等功能）。

### 1. 前端Socket.IO
```bash
npm install socket.io-client
```
```javascript
import { io } from 'socket.io-client';

// 连接
const socket = io('http://localhost:3000', {
  transports: ['websocket'], // 强制使用WebSocket
});

// 连接成功
socket.on('connect', () => {
  console.log('连接成功');
  // 发送消息
  socket.emit('clientMsg', { msg: 'Hello Socket.IO' });
});

// 接收服务端消息
socket.on('serverMsg', (data) => {
  console.log(data);
});

// 断开连接
socket.on('disconnect', () => {
  console.log('连接断开');
});
```

### 2. NestJS Socket.IO 网关
```typescript
import { WebSocketGateway, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketIoGateway implements OnGatewayConnection {
  handleConnection(client: Socket) {
    console.log('客户端连接：', client.id);
  }

  @SubscribeMessage('clientMsg')
  handleMessage(client: Socket, data: any) {
    // 广播给所有客户端
    client.broadcast.emit('serverMsg', data);
    // 给当前客户端发送消息
    client.emit('serverMsg', { msg: '消息已收到' });
  }
}
```

## 五、WebSocket 与 HTTP、SSE 对比
| 特性 | WebSocket | HTTP | SSE |
|------|-----------|------|-----|
| 通信方式 | 全双工 | 单向请求-响应 | 服务端→客户端单向 |
| 连接类型 | 长连接 | 短连接/长连接 | 长连接 |
| 数据格式 | 文本/二进制 | 文本/二进制 | 纯文本 |
| 自动重连 | 不支持（需手动） | 无 | 支持 |
| 适用场景 | 强实时双向通信 | 常规数据请求 | 单向实时推送 |
| 性能开销 | 低 | 高（轮询） | 中 |

## 六、常见问题与优化
1. **生产环境必须用wss://**：避免数据被窃取、篡改，兼容HTTPS页面
2. **心跳机制**：定时发送心跳包，避免连接被代理服务器断开
3. **连接限流**：服务端限制单IP连接数，防止恶意请求
4. **数据校验**：接收数据时做格式校验，防止非法数据
5. **异常处理**：完善重连、错误捕获机制，提升稳定性
6. **Nginx代理配置**：
```nginx
location /websocket {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_connect_timeout 60s;
    proxy_read_timeout 86400s;
}
```
