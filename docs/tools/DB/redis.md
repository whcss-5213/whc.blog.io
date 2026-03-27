edis

```bash
pnpm install ioredis
```


##  通用连接
```javascript
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // password: 'xxx'
});
```
- 存对象 → Hash
​
- 排行榜 → ZSet
​
- 队列/时间线 → List
​
- 去重/共同好友 → Set
​
- 缓存/计数器/锁 → String
​
- 签到/状态 → Bitmap
​
- 海量UV统计 → HyperLogLog
​
- 附近的人 → GEO

##  1. String 字符串
增 / 改
```javascript
await redis.set('name', 'zhangsan');
// 带过期 60 秒
await redis.set('name', 'zhangsan', 'EX', 60);
```

查
```javascript
const val = await redis.get('name');
```

删
```javascript
await redis.del('name');
```



##  2. Hash 哈希
增 / 改
```javascript
// 单个字段
await redis.hset('user:1', 'name', 'zhangsan');

// 多个字段
await redis.hset('user:1', {
  name: 'zhangsan',
  age: 20,
  sex: 'male'
});
```

查
```javascript
// 单个字段
const name = await redis.hget('user:1', 'name');

// 所有字段
const user = await redis.hgetall('user:1');

// 只拿所有 field 或 value
const fields = await redis.hkeys('user:1');
const values = await redis.hvals('user:1');
```

删
```javascript
// 删除某个字段
await redis.hdel('user:1', 'age');

// 删除整个 hash
await redis.del('user:1');
```



##  3. List 列表
增
```javascript
// 左边加
await redis.lpush('list', 'a', 'b', 'c');
// 右边加
await redis.rpush('list', 1, 2, 3);
```

查
```javascript
// 0 -1 查全部
const list = await redis.lrange('list', 0, -1);

// 获取下标元素
const item = await redis.lindex('list', 0);
```

改
```javascript
// 修改下标 0 的值
await redis.lset('list', 0, 'hello');
```

删
```javascript
// 左边弹出
await redis.lpop('list');
// 右边弹出
await redis.rpop('list');

// 删除指定值（count=0 删除所有）
await redis.lrem('list', 0, 'b');

// 删除整个 list
await redis.del('list');
```



##  4. Set 集合
增
```javascript
await redis.sadd('set', 'a', 'b', 'c', 'a'); // 自动去重
```

查
```javascript
// 所有成员
const members = await redis.smembers('set');

// 是否存在
const isMember = await redis.sismember('set', 'a');

// 数量
const count = await redis.scard('set');
```

删
```javascript
// 删除指定成员
await redis.srem('set', 'a');

// 随机弹出一个
await redis.spop('set');

// 删除整个集合
await redis.del('set');
```



##  5. ZSet 有序集合
增 / 改
```javascript
await redis.zadd('rank', 90, 'user1', 80, 'user2', 70, 'user3');
```

查
```javascript
// 正序（分数从低到高）
const asc = await redis.zrange('rank', 0, -1, 'WITHSCORES');

// 倒序（分数从高到低，排行榜常用）
const desc = await redis.zrevrange('rank', 0, -1, 'WITHSCORES');

// 查分数
const score = await redis.zscore('rank', 'user1');

// 查排名（从 0 开始）
const rank = await redis.zrank('rank', 'user1');
```

删
```javascript
// 删除成员
await redis.zrem('rank', 'user1');

// 按排名删
await redis.zremrangebyrank('rank', 0, 2);

// 按分数删
await redis.zremrangebyscore('rank', 0, 60);

// 删除整个 zset
await redis.del('rank');
```
对，确实少了 **Bitmap（位图）**，我给你补上 **Node.js / ioredis 版**的增删改查，和前面格式保持一致。

##  6. Bitmap 位图（基于 String）
增 / 改（设置某一位为 1 或 0）
```js
// 把 key=sign:20250101 的第 100 号用户位设为 1
await redis.setbit('sign:20250101', 100, 1);
```

查（查看某一位的值）
```js
// 查看第 100 位是 0 还是 1
const bit = await redis.getbit('sign:20250101', 100);
```

统计（常用：统计有多少个 1）
```js
// 统计签到人数
const count = await redis.bitcount('sign:20250101');
```

删
```js
// 删除整个位图
await redis.del('sign:20250101');
```

