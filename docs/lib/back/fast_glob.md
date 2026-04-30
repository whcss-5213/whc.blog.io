# fast-glob

快速、高性能的文件路径匹配库，用于批量查找文件/目录。

## 1 安装

```bash
pnpm add fast-glob
```

## 2 引入方式

```js
// ESM
import fg from 'fast-glob';

// CommonJS
const fg = require('fast-glob');
```

## 3 基础用法

### 异步（推荐）

```javascript
const files = await fg('**/*.js');
```

### 同步

```javascript
const files = fg.sync('**/*.js');
```

## 4 匹配规则

- `*` 匹配当前目录所有内容
- `**` 递归匹配所有子目录
- `!` 排除路径
- `{a,b}` 多后缀匹配
- `?` 匹配单个字符


## 5 高级匹配模式

```javascript
// 取并集与交集
// fast-glob 默认返回所有匹配的并集，排除规则优先
const files = await fg(['src/**/*.js', '!src/**/*.test.js']);

// 使用 `{a,b}` 匹配多后缀或前缀
const files = await fg(['*.{js,ts,json}']);

// 使用 `?` 匹配单个字符
const files = await fg('file?.txt'); // file1.txt, fileA.txt

// 转义特殊字符（用 `\\` 或 `[.]`）
const files = await fg('**/\\*.js');      // 匹配字面量 *.js
const files = await fg('**/[.]js');       // 同上

```

## 6 常用示例

```javascript
// 匹配所有 js/ts 文件
const files = await fg(['**/*.js', '**/*.ts']);

// 排除 node_modules
const files = await fg('**/*.js', {
  ignore: ['node_modules/**'],
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

## 7 常用配置项

| 配置项          | 说明            | 默认值        |
| --------------- | --------------- | ------------- |
| cwd             | 查找根目录      | process.cwd() |
| absolute        | 返回绝对路径    | false         |
| onlyFiles       | 只返回文件      | true          |
| onlyDirectories | 只返回目录      | false         |
| ignore          | 排除规则        | []            |
| deep            | 递归深度        | Infinity      |
| dot             | 匹配 . 开头文件 | false         |
| unique          | 去重            | true          |
| `followSymbolicLinks` | 是否跟随符号链接                       | true          |
| `throwErrorOnBrokenSymbolicLink` | 遇到损坏的链接是否抛出错误              | false         |
| `caseSensitiveMatch` | 是否大小写敏感（Linux 默认敏感，Windows 默认不敏感） | 平台相关 |
| `fs`            | 自定义文件系统（用于测试或 mock）       | Node.js `fs`  

## 8 性能与注意事项

1. **大目录扫描**：`**` 会递归所有子目录，建议配合 `deep` 限制深度，或用 `ignore` 排除 `node_modules` 等目录。
2. **符号链接**：默认跟随符号链接，可能导致循环递归，可设置 `followSymbolicLinks: false`。
3. **缓存**：`fast-glob` 内部有缓存机制，多次调用相同的模式会更快。如需清除缓存可使用 `fg.stream()` 或重新构造。
4. **与 `glob` 对比**：
   - 速度更快（比 `glob` 快 2~10 倍）
   - 支持 Promise/async
   - 默认忽略 `.` 开头的文件/目录（通过 `dot: true` 开启）
   - 更简单的排除模式（无需使用 `ignore` 的复杂语法）
5. **错误处理**：默认不会因单个目录无权限而终止，但会静默跳过。可通过 `suppressErrors: false` 抛出错误。


## 9 流式处理（处理海量文件）

```javascript
// 使用 stream 逐个返回结果，避免内存爆炸
const stream = fg.stream('**/*.js');

stream.on('data', (file) => console.log(file));
stream.on('end', () => console.log('done'));
stream.on('error', (err) => console.error(err));
```