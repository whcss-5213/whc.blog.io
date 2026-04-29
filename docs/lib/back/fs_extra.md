# fs-extra 用法

Node.js fs 模块增强版，支持 Promise、自动创建目录、递归操作。

## 1 安装

```bash
npm install fs-extra
pnpm add fs-extra
```

2 引入

```javascript
// ESM
import fs from 'fs-extra';

// CommonJS
const fs = require('fs-extra');
```

3 文件操作

读取文件

```javascript
const content = await fs.readFile('test.txt', 'utf8');
```

写入文件（自动创建目录）

```javascript
await fs.writeFile('a/b/c/test.txt', 'hello world');

// 语义更明确的输出方法（效果等价）
await fs.outputFile('a/b/c/test.txt', 'hello world');
```

追加内容

```javascript
await fs.appendFile('log.txt', '新的一行\n');
```

JSON 读写

```javascript
// 写入 JSON
await fs.writeJson('data.json', { name: 'test' }, { spaces: 2 });

// 读取 JSON
const data = await fs.readJson('data.json');
```

流式操作（大文件处理）

```javascript
const readStream = fs.createReadStream('big.log');
const writeStream = fs.createWriteStream('copy.log');
readStream.pipe(writeStream);
```

4 目录操作

创建多级目录

```javascript
await fs.ensureDir('logs/2026/03');
```

删除文件/目录（递归）

```javascript
await fs.remove('dist');   // 危险！类似 rm -rf
```

复制文件/目录

```javascript
await fs.copy('src', 'dist');                    // 默认覆盖目标
await fs.copy('src', 'dist', { overwrite: false }); // 禁止覆盖
```

移动/重命名

```javascript
await fs.move('a.txt', 'b.txt');   // 跨分区时会降级为“复制+删除”
```

清空目录

```javascript
await fs.emptyDir('temp');   // 保留目录本身，只清空内容
```

符号链接操作

```javascript
// 确保软链接存在（自动创建父目录）
await fs.ensureSymlink('./target', './link');

// 读取链接指向的路径
const realPath = await fs.readlink('./link');
```

5 判断与状态

```javascript
// 判断路径是否存在
const exists = await fs.pathExists('test.txt');  // 推荐，替代废弃的 fs.exists

// 获取文件状态
const stats = await fs.stat('test.txt');
console.log(stats.isFile());       // 是否为文件
console.log(stats.isDirectory());  // 是否为目录
console.log(stats.size);           // 文件大小（字节）
console.log(stats.mtime);          // 最后修改时间
console.log(stats.ctime);          // 状态修改时间
console.log(stats.birthtime);      // 创建时间
console.log(stats.mode);           // 权限位

// 读取目录列表
const items = await fs.readdir('src');
```

权限与所有者

```javascript
await fs.chmod('file.txt', 0o755);
await fs.chown('file.txt', uid, gid);
```

监听文件变化

```javascript
fs.watch('./src', (eventType, filename) => {
  console.log(`${filename} 发生 ${eventType}`);
});
```

6 同步方法

```javascript
fs.ensureDirSync('output');
fs.copySync('src', 'backup');
fs.removeSync('cache');
```

7 常用方法速查表

方法 功能
ensureDir 确保目录存在
remove 递归删除
copy 复制文件/目录
move 移动/重命名
emptyDir 清空目录
writeJson / readJson JSON 读写
pathExists 判断存在
readFile / writeFile 文件读写
outputFile / outputJson 写入文件（自动创建目录）
appendFile 追加内容
ensureSymlink 创建软链接
createReadStream / createWriteStream 流式读写
watch 监听文件/目录变化
chmod / chown 权限/所有者修改

8 与原生 fs 模块的关系

fs-extra 导出了全部原生 fs 方法，并将异步方法自动 Promise 化。因此：

```javascript
// 可直接使用原生方法（无需回调）
await fs.rename('old.txt', 'new.txt');
await fs.chmod('file.txt', 0o755);
```

> 📌 注意：原生 fs.exists 已被废弃，请使用 fs.pathExists（fs-extra 提供）或 fs.access。

9 常见注意事项

方法 注意事项
remove 行为类似 rm -rf，危险！会递归删除整个目录树。
emptyDir 清空目录内容，但保留目录本身（不同于 remove 后重建）。
copy 默认覆盖目标文件，可通过 { overwrite: false } 禁止覆盖。
move 跨分区移动时会自动降级为“复制+删除原文件”。
pathExists 比原生 exists 更可靠（原生 exists 已废弃，推荐使用 access）。
stat 返回的 Stats 对象还有 ctime、birthtime、mode 等属性，可进一步获取。
豆包：
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

// 语义更明确的输出方法（效果等价）
await fs.outputFile('a/b/c/test.txt', 'hello world');
```

### 追加内容

```javascript
await fs.appendFile('log.txt', '新的一行\n');
```

### JSON 读写

```javascript
// 写入 JSON
await fs.writeJson('data.json', { name: 'test' }, { spaces: 2 });

// 读取 JSON
const data = await fs.readJson('data.json');
```

### 流式操作（大文件处理）

```javascript
const readStream = fs.createReadStream('big.log');
const writeStream = fs.createWriteStream('copy.log');
readStream.pipe(writeStream);
```

## 4 目录操作

### 创建多级目录

```javascript
await fs.ensureDir('logs/2026/03');
```

### 删除文件/目录（递归）

```javascript
await fs.remove('dist');   // 危险！类似 rm -rf
```

### 复制文件/目录

```javascript
await fs.copy('src', 'dist');                    // 默认覆盖目标
await fs.copy('src', 'dist', { overwrite: false }); // 禁止覆盖
```

### 移动/重命名

```javascript
await fs.move('a.txt', 'b.txt');   // 跨分区时会降级为“复制+删除”
```

### 清空目录

```javascript
await fs.emptyDir('temp');   // 保留目录本身，只清空内容
```

### 符号链接操作

```javascript
// 确保软链接存在（自动创建父目录）
await fs.ensureSymlink('./target', './link');

// 读取链接指向的路径
const realPath = await fs.readlink('./link');
```

## 5 判断与状态

```javascript
// 判断路径是否存在
const exists = await fs.pathExists('test.txt');  // 推荐，替代废弃的 fs.exists

// 获取文件状态
const stats = await fs.stat('test.txt');
console.log(stats.isFile());       // 是否为文件
console.log(stats.isDirectory());  // 是否为目录
console.log(stats.size);           // 文件大小（字节）
console.log(stats.mtime);          // 最后修改时间
console.log(stats.ctime);          // 状态修改时间
console.log(stats.birthtime);      // 创建时间
console.log(stats.mode);           // 权限位

// 读取目录列表
const items = await fs.readdir('src');
```

### 权限与所有者

```javascript
await fs.chmod('file.txt', 0o755);
await fs.chown('file.txt', uid, gid);
```

### 监听文件变化

```javascript
fs.watch('./src', (eventType, filename) => {
  console.log(`${filename} 发生 ${eventType}`);
});
```

## 6 同步方法

```javascript
fs.ensureDirSync('output');
fs.copySync('src', 'backup');
fs.removeSync('cache');
```

## 7 常用方法速查表

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
| outputFile / outputJson | 写入文件（自动创建目录） |
| appendFile | 追加内容 |
| ensureSymlink | 创建软链接 |
| createReadStream / createWriteStream | 流式读写 |
| watch | 监听文件/目录变化 |
| chmod / chown | 权限/所有者修改 |

## 8 与原生 fs 模块的关系

fs-extra 导出了全部原生 fs 方法，并将异步方法自动 Promise 化。因此：

```javascript
// 可直接使用原生方法（无需回调）
await fs.rename('old.txt', 'new.txt');
await fs.chmod('file.txt', 0o755);
```

> 📌 注意：原生 fs.exists 已被废弃，请使用 fs.pathExists（fs-extra 提供）或 fs.access。

## 9 常见注意事项

| 方法 | 注意事项 |
|------|----------|
| remove | 行为类似 rm -rf，危险！会递归删除整个目录树。 |
| emptyDir | 清空目录内容，但保留目录本身（不同于 remove 后重建）。 |
| copy | 默认覆盖目标文件，可通过 { overwrite: false } 禁止覆盖。 |
| move | 跨分区移动时会自动降级为“复制+删除原文件”。 |
| pathExists | 比原生 exists 更可靠（原生 exists 已废弃，推荐使用 access）。 |
| stat | 返回的 Stats 对象还有 ctime、birthtime、mode 等属性，可进一步获取。 |


## 10 获取匹配详情

```javascript
// 返回对象数组：path, depth, dirent
const entries = await fg('**/*.js', { onlyFiles: false, stats: false });
// 启用 stats 可获得文件状态（性能稍降）
const withStats = await fg('**/*.js', { stats: true });
console.log(withStats[0].stats.size);
```