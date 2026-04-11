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

## createImageBitmap

```js
/**
 * @param {File|Blob} file 原图文件
 * @param {number} maxWidth 最大宽度
 * @param {number} maxHeight 最大高度
 * @param {number} quality 压缩质量 0~1
 * @returns {Promise<Blob>} 缩略图Blob
 */
async function createThumbnailFast(file, maxWidth = 300, maxHeight = 300, quality = 0.8) {
  // 拦截非图片类型
  if (!file.type.startsWith('image/')) {
    throw new Error('仅支持图片文件');
  }

  let bitmap = null;
  try {
    // 1. 先获取原始尺寸计算缩放比例
    const tempBitmap = await createImageBitmap(file);
    let { width, height } = tempBitmap;
    tempBitmap.close(); // 临时释放

    // 计算等比缩放系数
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    const targetW = Math.round(width * ratio);
    const targetH = Math.round(height * ratio);

    // 2. 内置缩放解码（性能更优）
    bitmap = await createImageBitmap(file, {
      resizeWidth: targetW,
      resizeHeight: targetH,
      resizeQuality: 'high'
    });

    // 3. Canvas 绘制兜底导出
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    ctx.drawImage(bitmap, 0, 0);

    // 4. 转Blob封装Promise
    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('生成缩略图失败')),
        file.type || 'image/jpeg',
        quality
      );
    });
  } catch (err) {
    console.error('高性能缩略图生成失败：', err);
    throw err;
  } finally {
    // 确保一定释放位图，防止内存泄漏
    if (bitmap) bitmap.close();
  }
}

// 使用示例
document.querySelector('input[type="file"]')
  .addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const thumbBlob = await createThumbnailFast(file, 300, 300, 0.8);
      // 预览示例（注意用完 revoke）
      const previewUrl = URL.createObjectURL(thumbBlob);
      document.getElementById('previewImg').src = previewUrl;
      // 图片加载后释放
      document.getElementById('previewImg').onload = () => {
        URL.revokeObjectURL(previewUrl);
      };
      
      // 后续可直接上传 thumbBlob
    } catch (err) {
      alert(err.message);
    }
  });
```
