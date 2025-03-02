# BOM

> Browser Object Model

## window
### 定时器

   ```js
let timeout = setTimeout(() => {
}, timeout);
clearTimeout(timeout)
   ```

```js
let interval = setInterval(() => {
}, interval);
clearInterval(interval)
```

### 对话框

```js
// 对话框
let alert = window.alert('hello world')
// 确认框
let confirm = Window.confirm('Are you sure')
// 对话框
let prompt = window.prompt("what's your name")
```

## location

```js
location.assign('https://www.baidu.com')
location.replace('https://www.baidu.com')
location.reload()
location.reload(true)
```

| 属性       | 描述                    |
|:---------|:----------------------|
| hash     | 从井号 (#) 开始的 URL（锚）    |
| host     | 主机名和当前 URL 的端口号       |
| hostname | 当前 URL 的主机名           |
| href     | 完整的 URL               |
| pathname | 当前 URL 的路径部分          |
| port     | 当前 URL 的端口号           |
| protocol | 当前 URL 的协议            |
| search   | 从问号 (?) 开始的 URL（查询部分） |

## history

```js
history.go(-1)
history.back()

history.go(1)
history.forward()

history.length

history.pushState(state, title, URL)
history.replaceState()

```
### hashchange

1.‌ 直接更改浏览器地址栏‌：在地址栏中直接添加或修改“#”后的部分。

‌2. 通过JavaScript修改‌：使用location.href或location.hash属性。

‌3. 点击带锚点的链接‌：点击带有锚点的链接也会导致hashchange事件触发。

‌4. 浏览器前进后退‌：如果前后页面的hash值不同，前进或后退操作也会触发hashchange事件‌


```js
window.addEventListener('hashchange', () => {
})
```
### popstate

当用户点击浏览器的前进或后退按钮，或者通过调用history的back、go、forward方法时，popstate事件会被触发。

```js
window.addEventListener('popstate', () => {
})
```

## navigator

```js
navigator.userAgent
navigator.platform
navigator.language
navigator.onLine
navigator.cookieEnabled
```

## screen

```js
screen.width
screen.height
screen.availWidth
screen.availHeight
screen.colorDepth
screen.pixelDepth
```