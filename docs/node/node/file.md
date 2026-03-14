# 文件操作模块

## fs/promise

### 文件操作

## path

### 路径操作

#### 1. `path.normalize()`

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

#### 2. `path.join()`

**作用：拼接路径片段，自动处理分隔符**

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

#### 3. `path.resolve()`

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

三句话终极总结

1. **`normalize`**：清理路径（去 `../` `./` `//`）
2. **`join`**：拼接路径（最常用）
3. **`resolve`**：转**绝对路径**

### name

#### 1. path.basename() 

```js
const path = require('path');

const filePath = '/root/react/index.js';
const fileName = path.basename(filePath);

console.log(fileName);
// index.js
```

**一句话：获取路径中的文件名（包含后缀）。**

#### 2. path.extname() 

```js
const path = require('path');

const filePath = '/root/react/index.js';
const ext = path.extname(filePath);

console.log(ext);
// .js
```

**一句话：获取文件的后缀名（包含 `.`）。**

#### 3. path.dirname() 

```js
const path = require('path');

const filePath = '/root/react/index.js';
const dir = path.dirname(filePath);

console.log(dir);
// /root/react
```

**一句话：获取文件所在的目录路径。**

## url

```javascript
const url = require('url');
import url from 'url';
```

---

### 1. `url.parse()` 

把一长串网址拆成 **协议、域名、路径、参数** 等。

```js
const myUrl = 'https://www.baidu.com:8080/user?id=123&name=jack#top';

const result = url.parse(myUrl, true); // 第二个参数 true = 自动解析 query
console.log(result);
```

**解析后得到：**

```js
{
  protocol: 'https:',     // 协议
  host: 'www.baidu.com:8080', // 域名 + 端口
  hostname: 'www.baidu.com', // 域名
  port: '8080',           // 端口
  pathname: '/user',      // 路径
  query: { id: '123', name: 'jack' }, // 参数对象
  hash: '#top',           // 锚点
  href: 'https://www.baidu.com:8080/user?id=123&name=jack#top'
}
```

---

### 2. `url.format()`

和 `parse` 相反，**对象 → 完整 URL**。

```js
const obj = {
  protocol: 'https',
  hostname: 'baidu.com',
  pathname: '/user',
  query: { id: 1 },
};

const fullUrl = url.format(obj);
// https://baidu.com/user?id=1
```

### 3. `url.resolve()` 

**自动拼接基础 URL + 相对路径**，自动处理 `/`。

```js
const base = 'https://baidu.com/user/';
const path = 'profile';

const result = url.resolve(base, path);
// https://baidu.com/user/profile
```

```js
url.resolve('https://a.com/b/c', '../d');
// https://a.com/d
```

### 4. `new URL()`

Node.js 推荐使用 **WHATWG URL API**（浏览器也通用）

```js
const myUrl = new URL('https://baidu.com/user?id=1');

console.log(myUrl.hostname); // baidu.com
console.log(myUrl.pathname); // /user
console.log(myUrl.searchParams.get('id')); // 1
```

- 🔥 终极总结

1. **`url.parse()`**：把 URL 拆成对象（拿参数、域名）
2. **`url.format()`**：把对象拼成 URL
3. **`url.resolve()`**：安全拼接 URL 路径
4. **`new URL()`**：现代标准用法（推荐）
