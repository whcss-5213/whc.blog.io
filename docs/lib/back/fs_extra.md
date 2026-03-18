# fs-extra 用法

Node.js fs 模块增强版，支持 Promise、自动创建目录、递归操作。

## 1 安装

```bash
npm install fs-extra
pnpm add fs-extra
```

## 2 引入

```javascript
// ESM
import fs from 'fs-extra';

// CommonJS
const fs = require('fs-extra');
```

## 3 文件操作

### 读取文件

```javascript
const content = await fs.readFile('test.txt', 'utf8');
```

### 写入文件（自动创建目录）

```javascript
await fs.writeFile('a/b/c/test.txt', 'hello world');
```

### JSON 读写

```javascript
// 写入 JSON
await fs.writeJson('data.json', { name: 'test' }, { spaces: 2 });

// 读取 JSON
const data = await fs.readJson('data.json');
```

## 4 目录操作

### 创建多级目录

```javascript
await fs.ensureDir('logs/2026/03');
```

### 删除文件/目录（递归）

```javascript
await fs.remove('dist');
```

### 复制文件/目录

```javascript
await fs.copy('src', 'dist');
```

### 移动/重命名

```javascript
await fs.move('a.txt', 'b.txt');
```

### 清空目录

```javascript
await fs.emptyDir('temp');
```

## 5 判断与状态

```javascript
// 判断路径是否存在
const exists = await fs.pathExists('test.txt');

// 获取文件状态
const stat = await fs.stat('test.txt');
stat.isFile();
stat.isDirectory();

// 读取目录列表
const items = await fs.readdir('src');
```

## 6 同步方法

```javascript
fs.ensureDirSync('output');
fs.copySync('src', 'backup');
fs.removeSync('cache');
```

## 7 常用方法速查表

| 方法                 | 功能          |
| -------------------- | ------------- |
| ensureDir            | 确保目录存在  |
| remove               | 递归删除      |
| copy                 | 复制文件/目录 |
| move                 | 移动/重命名   |
| emptyDir             | 清空目录      |
| writeJson / readJson | JSON 读写     |
| pathExists           | 判断存在      |
| readFile / writeFile | 文件读写      |
