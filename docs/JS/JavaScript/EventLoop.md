# Event Loop

## 一、为什么需要事件循环？
JavaScript 是**单线程、非阻塞、异步**的脚本语言：
- 单线程：同一时间只能执行一个任务，避免多线程操作DOM带来的冲突
- 非阻塞：通过异步机制，避免耗时任务（定时器、网络请求、IO操作）阻塞主线程

**事件循环**是JS实现异步的核心机制，负责调度执行栈、宏任务、微任务，保证代码有序执行。

## 二、核心基础概念
### 1. 执行栈（Call Stack）
- 同步代码的执行环境，遵循**先进后出**原则
- 主线程读取同步代码，依次推入执行栈，执行完毕后弹出
- 执行栈为空时，才会从任务队列中读取任务执行

### 2. 任务队列（Task Queue）
异步任务完成后，会被放入对应的任务队列，等待执行栈空闲后调用。
任务分为**宏任务（Macrotask）**和**微任务（Microtask）**，二者执行优先级完全不同。

## 三、宏任务 VS 微任务
### 1. 宏任务（Macrotask）
- 由宿主环境（浏览器/Node.js）提供，优先级较低
- 每次事件循环，**只执行一个宏任务**
- 常见宏任务：
  - script整体代码
  - setTimeout/setInterval
  - XMLHttpRequest/fetch 网络请求
  - I/O操作
  - UI渲染
  - MessageChannel
  - setImmediate（Node.js）

### 2. 微任务（Microtask）
- 由JS引擎自身提供，优先级远高于宏任务
- 执行完一个宏任务后，**会清空当前所有微任务队列**
- 常见微任务：
  - Promise.then/catch/finally
  - async/await（底层是Promise）
  - queueMicrotask()
  - MutationObserver（浏览器）
  - process.nextTick（Node.js，优先级高于普通微任务）

## 四、事件循环完整执行流程
1. 主线程执行**同步代码**，推入执行栈，同步代码执行完毕，执行栈清空
2. 执行当前**所有微任务**，依次清空微任务队列，直到微任务队列为空
3. 取出**一个宏任务**，推入执行栈执行
4. 宏任务执行完毕，再次清空所有微任务
5. 循环往复，直到所有任务执行完毕

**核心口诀：同步先执行 → 微任务清空 → 宏任务一个 → 再清微任务 → 循环**

## 五、浏览器事件循环执行顺序案例
### 案例代码
```javascript
console.log('同步代码1');

// 宏任务1
setTimeout(() => {
  console.log('setTimeout1');
  // 微任务3
  Promise.resolve().then(() => {
    console.log('Promise then3');
  });
}, 0);

// 微任务1
Promise.resolve().then(() => {
  console.log('Promise then1');
});

// 微任务2
queueMicrotask(() => {
  console.log('queueMicrotask');
});

console.log('同步代码2');

// 宏任务2
setTimeout(() => {
  console.log('setTimeout2');
}, 0);
```

### 执行结果
```
同步代码1
同步代码2
Promise then1
queueMicrotask
setTimeout1
Promise then3
setTimeout2
```

### 执行步骤解析
1. 执行同步代码，依次打印：同步代码1、同步代码2
2. 执行栈清空，清空微任务队列：打印Promise then1、queueMicrotask
3. 执行第一个宏任务（setTimeout1）：打印setTimeout1，新增微任务Promise then3
4. 再次清空微任务队列：打印Promise then3
5. 执行第二个宏任务（setTimeout2）：打印setTimeout2

## 六、async/await 执行机制
async/await 是Promise的语法糖，执行规则：
1. async函数内，**await之前的代码同步执行**
2. await 后面的代码，会被包装成**微任务**，等待Promise状态改变后执行

### 案例
```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end'); // 微任务
}
async function async2() {
  console.log('async2');
}
console.log('script start');
async1();
setTimeout(() => {
  console.log('setTimeout'); // 宏任务
}, 0);
console.log('script end');
```
### 结果
```
script start
async1 start
async2
script end
async1 end
setTimeout
```

## 七、浏览器 vs Node.js 事件循环差异
1. **浏览器**：宏任务队列只有一个，按任务加入顺序执行
2. **Node.js**：宏任务分为多个队列（timers、pending callbacks、idle/prepare、poll、check、close callbacks），按固定阶段执行
3. Node.js中`process.nextTick`优先级高于所有微任务，浏览器无此API

## 八、高频面试考点
1. 微任务和宏任务的优先级？
   → 微任务优先级高于宏任务，每次宏任务执行完必清空微任务
2. Promise构造函数内的代码是同步还是异步？
   → 同步执行，then/catch/finally才是微任务
3. 多个await代码的执行顺序？
   → 每个await后续代码都会依次加入微任务队列，按顺序执行
4. script整体代码属于什么任务？
   → 宏任务，是事件循环的第一个执行的宏任务

