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

