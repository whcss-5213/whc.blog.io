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

```js
const STATUS_PENDING = "pending";
const STATUS_FULFILLED = "fulfilled";
const STATUS_REJECTED = "rejected";

class _Promise {
    constructor(executor = () => {}) {
        // 初始化订单默认状态：全部处于待接单
        this.status = STATUS_PENDING;
        // 存放配送完成的餐品结果
        this.value = undefined;
        // 存放订单拒收的原因备注
        this.reason = undefined;

        // 骑手任务收纳篓：排队等候的配送任务/拒收善后任务
        this.resolveQueue = [];
        this.rejectQueue = [];

        // 配送放行开关：只有待接单能改成完成，批量执行所有等候配送骑手
        const resolve = (value) => {
            if (this.status === STATUS_PENDING) {
                this.status = STATUS_FULFILLED;
                this.value = value;
                this.resolveQueue.forEach(fn => fn(this.value));
            }
        };

        // 订单拒收开关：只有待接单能改成取消，批量执行善后骑手任务
        const reject = (reason) => {
            if (this.status === STATUS_PENDING) {
                this.status = STATUS_REJECTED;
                this.reason = reason;
                this.rejectQueue.forEach(fn => fn(this.reason));
            }
        };

        // 后厨出餐容错：做饭翻车直接判订单失败，不瘫痪整个店铺
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        // 链式核心：每接一单就生成全新订单，实现骑手接力直送，完成异步时间扁平化
        return new _Promise((nextResolve, nextReject) => {
            // 统一封装正规配送骑手任务
            const handleSuccess = () => {
                // 骑手上岗核验+原值代送透传+送餐中途意外兜底
                try {
                    const res = typeof onFulfilled === 'function' ? onFulfilled(this.value) : this.value;
                    nextResolve(res);
                } catch (err) {
                    nextReject(err);
                }
            };
            // 统一封装订单善后退款骑手任务
            const handleFail = () => {
                // 坏单兜底核验+原因透传+善后出错应急保护
                try {
                    const err = typeof onRejected === 'function' ? onRejected(this.reason) : this.reason;
                    nextResolve(err);
                } catch (err) {
                    nextReject(err);
                }
            };

            // 根据订单当前状态调度骑手
            if (this.status === STATUS_FULFILLED) {
                handleSuccess(); // 已出餐直接派送
            } else if (this.status === STATUS_REJECTED) {
                handleFail(); // 已拒收直接善后
            } else if (this.status === STATUS_PENDING) {
                // 只收正经上岗骑手进任务篓，杂牌无效骑手直接拒收
                typeof onFulfilled === 'function' && this.resolveQueue.push(handleSuccess);
                typeof onRejected === 'function' && this.rejectQueue.push(handleFail);
            }
        });
    }
}

```
