# File 

## Blob
Binary Large Object，二进制大对象，浏览器原生**只读二进制数据容器**。

不可修改，只能通过 `slice` 生成新 Blob。


**Blob 构造**
```js
const blob = new Blob([数据], { 
"text/plain;charset=utf-8"        // txt
application/json  // json
text/csv          // csv
image/png         // 图片
image/jpeg        // 图片
application/pdf   // pdf
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet // xlsx
application/octet-stream // 通用二进制: MIME类型 })
```



## File
代表用户本地文件，只能通过**用户交互**获取（input / 拖拽）。
**无专属方法，全部继承 Blob**。

### 常用属性
```js
file.name         // 文件名
file.size         // 大小(字节)
file.type         // MIME类型
file.lastModified // 最后修改时间戳
```



### 常用方法
```js
// 切割分片（分片上传核心）
file.slice(start, end)

// 异步读取文本
await file.text()

// 读取二进制
await file.arrayBuffer()

// 流式读取
file.stream()
```



### input 获取 File
```html
<input type="file" id="file" />
```

```js
fileInput.onchange = (e) => {
  const file = e.target.files[0]
}
```
```js
const dropArea = document.getElementById('dropArea')
// 阻止默认拖拽行为
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault()
})
// 监听文件拖拽释放
dropArea.addEventListener('drop', (e) => {
  e.preventDefault()
  const fileList = e.dataTransfer.files
  const file = fileList[0]
})
```


### 分片上传
核心：**Blob.slice() 切割大文件**，分批上传，后端合并。

```js
const chunkSize = 5 * 1024 * 1024 // 5MB
const total = Math.ceil(file.size / chunkSize)

for (let i = 0; i < total; i++) {
  const start = i * chunkSize
  const end = Math.min(file.size, start + chunkSize)
  const chunk = file.slice(start, end)
  // 上传 chunk
}
```

### URL
**生成临时可访问 URL**
```js
const url = URL.createObjectURL(file/blob)
```

**释放 URL（必须）**
```js
URL.revokeObjectURL(url)
```

**图片预览**
```js
img.src = URL.createObjectURL(file)
```

**下载 txt 文件**
```js
const blob = new Blob(['内容'], { type: 'text/plain' })
const a = document.createElement('a')
a.href = URL.createObjectURL(blob)
a.download = 'test.txt'
a.click()
```