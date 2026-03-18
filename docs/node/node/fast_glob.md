# 1. fast-glob 用法
快速、高性能的文件路径匹配库，用于批量查找文件/目录。

## 1.1 安装
```bash
pnpm add fast-glob
```

## 1.2 引入方式
```js
// ESM
import fg from 'fast-glob';

// CommonJS
const fg = require('fast-glob');
```

## 1.3 基础用法
### 异步（推荐）
```javascript
const files = await fg('**/*.js');
```

### 同步
```javascript
const files = fg.sync('**/*.js');
```

## 1.4 匹配规则
- `*` 匹配当前目录所有内容
- `**` 递归匹配所有子目录
- `!` 排除路径
- `{a,b}` 多后缀匹配
- `?` 匹配单个字符

## 1.5 常用示例
```javascript
// 匹配所有 js/ts 文件
const files = await fg(['**/*.js', '**/*.ts']);

// 排除 node_modules
const files = await fg('**/*.js', {
  ignore: ['node_modules/**']
});

// 获取绝对路径
const files = await fg('**/*', { absolute: true });

// 只获取目录
const dirs = await fg('**/', { onlyDirectories: true });

// 只获取文件
const files = await fg('**/*', { onlyFiles: true });

// 匹配隐藏文件
const files = await fg('**/.*', { dot: true });
```

## 1.6 常用配置项
| 配置项 | 说明 | 默认值 |
|-------|------|--------|
| cwd | 查找根目录 | process.cwd() |
| absolute | 返回绝对路径 | false |
| onlyFiles | 只返回文件 | true |
| onlyDirectories | 只返回目录 | false |
| ignore | 排除规则 | [] |
| deep | 递归深度 | Infinity |
| dot | 匹配 . 开头文件 | false |
| unique | 去重 | true |

---

# 2. fs-extra 用法
Node.js fs 模块增强版，支持 Promise、自动创建目录、递归操作。

## 2.1 安装
```bash
npm install fs-extra
pnpm add fs-extra
```

## 2.2 引入
```javascript
// ESM
import fs from 'fs-extra';

// CommonJS
const fs = require('fs-extra');
```

## 2.3 文件操作
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

## 2.4 目录操作
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

## 2.5 判断与状态
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

## 2.6 同步方法
```javascript
fs.ensureDirSync('output');
fs.copySync('src', 'backup');
fs.removeSync('cache');
```

## 2.7 常用方法速查表
| 方法 | 功能 |
|------|------|
| ensureDir | 确保目录存在 |
| remove | 递归删除 |
| copy | 复制文件/目录 |
| move | 移动/重命名 |
| emptyDir | 清空目录 |
| writeJson / readJson | JSON 读写 |
| pathExists | 判断存在 |
| readFile / writeFile | 文件读写 |

---

# 3. 组合使用（最佳实践）
```javascript
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';

(async () => {
  // 1. 查找所有 md 文件（排除 node_modules）
  const mdFiles = await fg('**/*.md', {
    ignore: ['node_modules/**'],
    absolute: true
  });

  // 2. 遍历处理文件
  for (const file of mdFiles) {
    const content = await fs.readFile(file, 'utf8');
    const newContent = content.replace(/old/g, 'new');
    await fs.writeFile(file, newContent);
  }

  // 3. 批量复制到 dist
  const distDir = path.resolve('dist');
  await fs.ensureDir(distDir);

  const files = await fg('**/*.{js,css,html}', { ignore: ['node_modules/**'] });
  for (const file of files) {
    const dest = path.join(distDir, file);
    await fs.copy(file, dest);
  }

  console.log('处理完成');
})();
```