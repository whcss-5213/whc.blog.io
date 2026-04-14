# axios


## config

```js
import axios from axios

const axios = axios.creat({
  
})

const params = new URLSearchParams();

params.append('param1', 'value1');
params.append('param2', 'value2');
axios.post('/foo', params);

```

## interceptors

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

````
## progressEvent

回调函数接收一个进度事件对象，主要属性：
 
-  loaded ：已传输字节数
-  total ：总字节数（服务器需返回  Content-Length ）
- total  为 0 / 无法计算进度：
服务器没返回  Content-Length  或开启了 chunked 传输
-  lengthComputable ：进度是否可计算（ total  是否有效）
  
### onUploadProgress
```js
import axios from 'axios';

// 1. 获取文件 & 构建 FormData
const fileInput = document.getElementById('file');
const file = fileInput.files[0];
const formData = new FormData();
formData.append('file', file);

// 2. 带进度监听的上传
axios.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  // 上传进度回调
  onUploadProgress: (progressEvent) => {
    if (progressEvent.lengthComputable) {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`上传进度：${percent}%`);
      // 更新 UI 进度条
      // document.getElementById('progress').value = percent;
    }
  }
})
.then(res => {
  console.log('上传成功', res.data);
})
.catch(err => {
  console.error('上传失败', err);
});

```
### onDownloadProgress


```js
import axios from 'axios';

axios.get('/api/download/large-file.zip', {
  responseType: 'blob', // 关键：返回二进制数据
  // 下载进度回调
  onDownloadProgress: (progressEvent) => {
    if (progressEvent.lengthComputable) {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度：${percent}%`);
      // 更新 UI 进度条
    }
  }
})
.then(res => {
  // 下载完成：创建链接自动保存
  const blob = new Blob([res.data]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'file.zip';
  a.click();
  URL.revokeObjectURL(url);
})
.catch(err => {
  console.error('下载失败', err);
});
```


## AbortController

```js
// 1. 创建控制器
const controller = new AbortController()
const signal = controller.signal

// 2. 发送请求，绑定 signal
axios({
  url: '/api/data',
  method: 'get',
  signal: signal
})

// 3. 取消请求
controller.abort()


.catch(err => {
  if (err.name === 'AbortError') {
    console.log('请求已取消')
  }
})


```

## 重复请求
```js
import axios from 'axios'

const pendingMap = new Map()

// 生成唯一请求 key
function getRequestKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加：重复则取消上一个
function addPending(config) {
  const key = getRequestKey(config)
  if (pendingMap.has(key)) {
    pendingMap.get(key)()
    pendingMap.delete(key)
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingMap.set(key, controller.abort.bind(controller))
}

// 移除请求记录
function removePending(config) {
  const key = getRequestKey(config)
  pendingMap.delete(key)
}

// 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截
service.interceptors.request.use(config => {
  addPending(config)
  return config
})

// 响应拦截
service.interceptors.response.use(
  res => {
    removePending(res.config)
    return res.data
  },
  err => {
    removePending(err.config || {})
    if (axios.isCancel(err)) return new Promise(() => {})
    return Promise.reject(err)
  }
)

export default service


```

