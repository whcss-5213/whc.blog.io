# node

## npm

### 源

```text
// npm设置新淘宝源
npm config set registry https://registry.npmmirror.com
// npm设置回本源
npm config set registry https://registry.npmjs.org
```

### pnpm

> Nothing to stop. No server is running for the store at

```powershell
pnpm install -g
pnpm install -g pnpm
```

## 全局变量

- global

  类似window对象

- __filename

  当前正在执行脚本的文件名

- __dirname

  当前正在执行脚本的目录路径

```js
console.log(global);
console.log(__filename); // d:\Desktop\node\index.js
console.log(__dirname); // d:\Desktop\node
```

## os 模块

- os.EOL
- os.cpus()
- os.totalmem() 总内存，单位:字节
- os.freemem()可用内存
- os.hostname()主机名
- os.type() 操作系统类型

## path模块

- path.basename('d:/a/b/c.html')  c.html

- path.dirname('d:/a/b/c.html') d:/a/b

- path.extname('d:/a/b/c.html') .html

- path.join()

  ```js
  path.join(...'/abc') // \a\b\c
  path.join(...'abc') // a\b\c
  ```

- path.resolve()

  ```js
  // 模拟cd操作
  path.resolve(...'/abc') // d:\a\b\c
  path.resolve(...'/abc') // e:\a\b\c
  ```

## url模块

```js
const url = require('url');
const bilibili = 'https://www.bilibili.com/'
parse(bilibili, true)
const Url1 = {
    protocol: 'https:',
    slashes: true,
    auth: null,
    host: 'www.bilibili.com',
    port: null,
    hostname: 'www.bilibili.com',
    hash: null,
    search: '?id=123',
    query: {id: '123'},
    pathname: '/',
    path: '/?id=123',
    href: 'https://www.bilibili.com/?id=123'
}

url.resolve('https://www.bilibili.com/', '?id=123')
// https://www.bilibili.com/?id=123
```

## querystring模块

```js
querystring.parse('useName=zhang&age=22&gender=m')
//  { name: 'zhang', age: '22', gender: 'm' }
querystring.stringify({name: 'li', age: 23, gender: 'woman'})
// name=li&age=23&gender=woman
```

## fs模块

```js
// 异步操作
fs.mkdir('log', err => {
    console.log(err)
})
fs.rename('./log', './logs', err => {
    console.log(err)
})
fs.rmdir('./logs', err => {
    console.log(err)
})
fs.writeFile('./logs/a.txt', 'hello', (err) => console.log(err))
fs.appendFile('./logs/a.txt', 'worlds', (err) => console.log(err))
fs.readFile('./logs/a.txt', 'utf-8', (err, content) => console.log(content))
```

```js
const fsPromises = require('fs').promises;
(async () => {
    const txt = await fsPromises.readFile('./logs/a.txt', 'utf-8')
    console.log(txt)
})()
```

```shell
const readline = require('readline');

const rl = readline.createInterface({

  input: process.stdin,

  output: process.stdout

})

rl.question('how are you?', (*answer*) => {

  console.log(*answer*)

  rl.close

})

const crypto = require('crypto');

const password = 'asd123asdf'

const base64 = crypto.createHash('sha1').update(password).digest('base64')

const hash = crypto.createHash('sha1').update(password).digest("hex")

console.log(base64)

console.log(hash)
```

## http

```js

```

## Multer

Multer是一个Node.js中间件，用于处理 multipart/form-data 类型的表单数据，主要用于文件上传，注意：Multer中间件不会处理任何非
multipart/form-data 类型的表单数据。



