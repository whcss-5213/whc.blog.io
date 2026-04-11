# Promise

## 一、三种状态（不可逆）
- **pending**（待定）：初始状态，操作未完成
- **fulfilled**（已兑现）：操作成功，通过 `resolve()`
- **rejected**（已拒绝）：操作失败，通过 `reject()`

## 二、基本用法
## 1. 创建 Promise
```javascript
const p = new Promise((resolve, reject) => {
  // 异步操作：请求、定时器等
  setTimeout(() => {
    const ok = true
    if (ok) {
      resolve('成功数据') // 变为 fulfilled
    } else {
      reject(new Error('失败原因')) // 变为 rejected
    }
  }, 1000)
})
```

## 2. then / catch / finally
```javascript
p
  .then(value => {
    console.log('成功:', value) // 处理 resolve
    return value + ' 处理后' // 可返回新值/新Promise
  })
  .then(newValue => console.log(newValue))
  .catch(err => {
    console.error('失败:', err) // 处理 reject/异常
  })
  .finally(() => {
    console.log('无论成败都执行') // 清理、收尾
  })
```

## 三、常用静态方法
- **Promise.resolve(value)**：直接返回 fulfilled 状态
- **Promise.reject(reason)**：直接返回 rejected 状态
- **Promise.all([p1,p2,...])**：**全部成功**才成功，返回结果数组；任一失败则整体失败
- **Promise.race([p1,p2,...])**：**谁先敲定**（成功/失败）就用谁的结果
- **Promise.allSettled([p1,p2,...])**：全部执行完，返回每个结果（含状态）
- **Promise.any([p1,p2,...])**：**任一成功**即成功；全失败才失败

## 四、async/await

```javascript
async function fetchData() {
  try {
    const res = await fetch('/api') // 等待 Promise 完成
    const data = await res.json()
    console.log(data)
  } catch (err) {
    console.error(err) // 捕获 reject/异常
  }
}
fetchData()

```

## MyPromise

```js
class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 存储多个 then 回调
    this.onFulfilledCbs = [];
    this.onRejectedCbs = [];

    const resolve = (value) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.value = value;
        // 微任务批量执行回调
        queueMicrotask(() => {
          this.onFulfilledCbs.forEach(cb => cb());
        });
      }
    };

    const reject = (reason) => {
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.reason = reason;
        queueMicrotask(() => {
          this.onRejectedCbs.forEach(cb => cb());
        });
      }
    };

    // 捕获执行器同步异常
    try {
      executor(resolve, reject);
    } catch (err)
      reject(err);
    }
  }

  // 核心：Promise/A+ 规范 resolvePromise 解析器
  static resolvePromise(x, promise2, resolve, reject) {
    // 1. 循环引用检测：返回自身直接报错
    if (x === promise2) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 标记是否已执行，防止 then 内多次调用 resolve/reject
    let called = false;

    // 2. x 是对象/函数：可能是 thenable
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
      try {
        const then = x.then;
        // 是标准 thenable
        if (typeof then === 'function') {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              // 递归解析 y
              MyPromise.resolvePromise(y, promise2, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // 普通对象无 then，直接 resolve
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      // 3. 普通基本类型值，直接决议
      resolve(x);
    }
  }

  then(onFulfilled, onRejected) {
    // 规范：回调穿透兜底
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };

    // then 必须返回新 Promise2
    const promise2 = new MyPromise((resolve, reject) => {
      // 成功处理逻辑
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            MyPromise.resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 失败处理逻辑
      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            MyPromise.resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      // 状态分支处理
      switch (this.status) {
        case MyPromise.FULFILLED:
          handleFulfilled();
          break;
        case MyPromise.REJECTED:
          handleRejected();
          break;
        case MyPromise.PENDING:
          this.onFulfilledCbs.push(handleFulfilled);
          this.onRejectedCbs.push(handleRejected);
          break;
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      val => MyPromise.resolve(callback()).then(() => val),
      err => MyPromise.resolve(callback()).then(() => { throw err; })
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(res => res(value));
  }

  static reject(reason) {
    return new MyPromise((_, rej) => rej(reason));
  }
}


```