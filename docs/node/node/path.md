# path 模块

## 路径操作

# 1. `path.normalize()`

**作用：规范化路径，把乱七八糟的路径整理干净**
自动处理：`./` 、`../` 、多余的 `/`

```js
const path = require('path');

const messyPath = '/root//JS/../react/./index.js';
const cleanPath = path.normalize(messyPath);

console.log(cleanPath);
// 输出：\root\react\index.js (Windows)
// 输出： /root/react/index.js (Mac/Linux)
```

**一句话：把脏路径变干净。**

# 2. `path.join()`

**作用：拼接路径片段，自动处理分隔符**
最常用！**千万不要用字符串 + 拼接路径**！

```js
const path = require('path');

const fullPath = path.join('JS', 'react', 'index.js');
console.log(fullPath);
// JS/react/index.js

// 自动处理 ../
const fullPath2 = path.join('JS', '..', 'react', 'index.js');
console.log(fullPath2);
// react/index.js
```

**一句话：安全拼接路径，自动适配系统分隔符。**

# 3. `path.resolve()`

**作用：把相对路径 → 解析成【绝对路径】**
从**右往左**拼接，遇到**根路径 /** 就停止

```js
const path = require('path');

// 当前工作目录 /Users/xxx
const absPath = path.resolve('JS', 'react', 'index.js');
console.log(absPath);
// /Users/xxx/JS/react/index.js
```

```js
// 遇到 / 会变成根路径
path.resolve('/JS', 'react');
// /JS/react
```

**一句话：把相对路径变成完整绝对路径。**

# 🔥 三句话终极总结

1. **`normalize`**：清理路径（去 `../` `./` `//`）
2. **`join`**：拼接路径（最常用）
3. **`resolve`**：转**绝对路径**

## name

1. path.basename() → 获取文件名（含后缀）
2. path.extname() → 获取文件后缀
3. path.dirname() → 获取文件所在目录
