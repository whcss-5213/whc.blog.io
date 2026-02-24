# BOM

> Browser Object Model

## window

### 定时器

```js
let timeout = setTimeout(() => {}, timeout);
clearTimeout(timeout);
```

```js
let interval = setInterval(() => {}, interval);
clearInterval(interval);
```

### 对话框

```js
// 对话框
window.alert('hello world');
// 确认框
let confirm = window.confirm('Are you sure');
// 对话框
let prompt = window.prompt("what's your name");
```

## location

```js
location.assign('https://www.baidu.com');
location.replace('https://www.baidu.com');
location.reload();
location.reload(true);
```

| 属性     | 描述                              |
| :------- | :-------------------------------- |
| hash     | 从井号 (#) 开始的 URL（锚）       |
| host     | 主机名和当前 URL 的端口号         |
| hostname | 当前 URL 的主机名                 |
| href     | 完整的 URL                        |
| pathname | 当前 URL 的路径部分               |
| port     | 当前 URL 的端口号                 |
| protocol | 当前 URL 的协议                   |
| search   | 从问号 (?) 开始的 URL（查询部分） |

## history

```js
history.go(-1);
history.back();

history.go(1);
history.forward();

history.length;

history.pushState(state, title, URL);
history.replaceState();
```

### hashchange

1.‌ 直接更改浏览器地址栏 ‌：在地址栏中直接添加或修改“#”后的部分。

‌2. 通过 JavaScript 修改 ‌：使用 location.href 或 location.hash 属性。

‌3. 点击带锚点的链接 ‌：点击带有锚点的链接也会导致 hashchange 事件触发。

‌4. 浏览器前进后退 ‌：如果前后页面的 hash 值不同，前进或后退操作也会触发 hashchange 事件 ‌

```js
window.addEventListener('hashchange', () => {});
```

### popstate

当用户点击浏览器的前进或后退按钮，或者通过调用 history 的 back、go、forward 方法时，popstate 事件会被触发。

```js
window.addEventListener('popstate', () => {});
```

## navigator

```js
navigator.userAgent;
navigator.language;
navigator.onLine;
navigator.cookieEnabled;
```

## screen

```js
screen.width;
screen.height;
screen.availWidth;
screen.availHeight;
screen.colorDepth;
screen.pixelDepth;
```

## cookie

```js
document.cookie = 'name=value; expires=date; path=path; domain=domain; secure';
```

- domain：指定 Cookie 生效的域名。默认当前域名，设为 .example.com 可在子域名下共享。
- expires：指定 Cookie 过期时间。默认会话结束，设为具体日期可持久化存储。
- name：Cookie 名称，不能包含空格或特殊字符。
- value：Cookie 值，不能包含空格或特殊字符。
- partitioned：是否为分区 Cookie，默认 false。
- path：指定 Cookie 生效的路径。默认当前路径，设为 / 可在所有路径下共享。
- secure：仅在 HTTPS 下传输 Cookie，防止中间人攻击。
- httpOnly：防止 JavaScript 访问 Cookie，增加安全性。
- sameSite：防止 CSRF 攻击，可选 Strict/Lax/None。

### cookieStore

```js
cookieStore.addEventListener('change', event => {});
```

```js
// 1. 获取单个 Cookie（异步，返回 Promise）
async function getCookie() {
  try {
    // 参数：Cookie 名称
    const userCookie = await cookieStore.get('username');
    if (userCookie) {
      console.log('Cookie 值：', userCookie.value); // 输出 Cookie 值
      console.log('Cookie 完整信息：', userCookie);
      // 完整结构：{ name: 'username', value: 'zhangsan', domain: 'example.com', path: '/', expires: Date对象, secure: true, httpOnly: false, sameSite: 'Lax' }
    } else {
      console.log('该 Cookie 不存在');
    }
  } catch (err) {
    console.error('获取 Cookie 失败：', err);
  }
}

// 2. 获取所有 Cookie
async function getAllCookies() {
  const allCookies = await cookieStore.getAll();
  console.log('所有 Cookie：', allCookies); // 返回 Cookie 对象数组
}

// 3. 设置 Cookie
async function setCookie() {
  try {
    // 方式1：简单设置（仅名称和值）
    await cookieStore.set('username', 'zhangsan');

    // 方式2：完整配置（推荐，明确所有属性）
    await cookieStore.set({
      name: 'token',
      value: 'abc123xyz',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1天后过期
      domain: 'localhost', // 生效域名（默认当前域名）
      path: '/', // 生效路径（默认当前路径）
      secure: true, // 仅 HTTPS 下传输（本地开发 localhost 例外）
      sameSite: 'Lax', // 防止 CSRF，可选 Strict/Lax/None
    });
    console.log('Cookie 设置成功');
  } catch (err) {
    console.error('设置 Cookie 失败：', err);
  }
}

// 4. 删除 Cookie
async function deleteCookie() {
  try {
    // 方式1：仅名称（默认 path="/"，domain 当前域名）
    await cookieStore.delete('username');

    // 方式2：指定路径/域名（删除带特殊配置的 Cookie 必须匹配）
    await cookieStore.delete({
      name: 'token',
      domain: 'localhost',
      path: '/',
    });
    console.log('Cookie 删除成功');
  } catch (err) {
    console.error('删除 Cookie 失败：', err);
  }
}

// 调用示例
setCookie().then(getCookie).then(getAllCookies).then(deleteCookie);
```

## storage

### localStorage

### sessionStorage
