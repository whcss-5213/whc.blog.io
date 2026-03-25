## 1. 防抖（debounce）
触发后**延迟执行**，频繁触发会重新计时（搜索框、窗口 resize、输入验证）

```js
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

使用：
```js
const handleInput = debounce(function (e) {
  console.log('发送请求', e.target.value);
}, 500);

input.addEventListener('input', handleInput);
```

---

## 2. 节流（throttle）
**固定时间内只执行一次**，防止高频触发（滚动、点击、拖拽）

```js
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

使用：
```js
const handleScroll = throttle(function () {
  console.log('滚动触发');
}, 500);

window.addEventListener('scroll', handleScroll);
```

---

## 3. 深拷贝（deepClone）
支持对象、数组、循环引用，简单稳定版

```js
function deepClone(obj, hash = new WeakMap()) {
  // 基本类型直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理 Map
  if (obj instanceof Map) {
    const map = new Map();
    hash.set(obj, map);
    obj.forEach((val, key) => {
      map.set(key, deepClone(val, hash));
    });
    return map;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const set = new Set();
    hash.set(obj, set);
    obj.forEach(val => {
      set.add(deepClone(val, hash));
    });
    return set;
  }

  // 数组 / 普通对象
  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }

  return clone;
}

```