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

## 6 常用配置项

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
