# BOM

> Browser Object Model

## 定时器

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

## 对话框

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

// 点击前进后退
window.addEventListener('popstate', () => {
})
```