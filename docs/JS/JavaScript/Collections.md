# Collections

## set

Set 是一种无序且唯一的数据结构，类似于数组，但成员值都是唯一的。

### 基本用法

```js
// 创建Set
const set = new Set();

// 添加元素
set.add(1);
set.add('hello');
set.add([1, 2]); // 引用类型可以重复添加

// 检查元素是否存在
console.log(set.has(1)); // true

// 删除元素
set.delete('hello');

// 获取大小
console.log(set.size); // 2

// 遍历Set
set.forEach((value) => {
  console.log(value);
});

// 清空Set
set.clear();
```

### 去重

```js
// 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3]

// 字符串去重
const str = 'aabbcc';
const uniqueStr = [...new Set(str)].join('');
console.log(uniqueStr); // 'abc'
```

### 交集 并集 补集

```js
let a = new Set([1, 2, 3, 4]);
let b = new Set([1, 5, 4, 9]);
//交集
let c = new Set([...a, ...b]);
//并集
let a1 = [...a];
let d = new Set(a1.filter((i) => b.has(i)));
// 补集
let a2 = [...a];
let e = new Set(a2.filter((i) => !b.has(i)));
```

## map

Map 是一种键值对的集合，与普通对象的主要区别在于：

- 键的类型不限：可以是任意类型（对象、函数、基本类型等）
- 有序性：按照插入顺序迭代元素
- 直接获取大小：通过 size 属性
- 高效的查找与删除

### 基本用法

```js
// 创建Map
const map = new Map();

// 添加键值对
map.set('name', '张三');
map.set(123, '数字键');
map.set({}, '对象键');

// 获取值
console.log(map.get('name')); // 张三

// 检查键是否存在
console.log(map.has(123)); // true

// 删除键值对
map.delete('name');

// 获取大小
console.log(map.size); // 2

// 遍历Map
map.forEach((value, key) => {
  console.log(key, value);
});

// 清空Map
map.clear();
```

### 深拷贝

```js
function deepClone(obj, map = new Map()) {
  // 处理原始值（非对象）
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 检查循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 创建新对象/数组
  const clone = Array.isArray(obj) ? [] : {};

  // 记录已处理的对象
  map.set(obj, clone);

  // 递归处理所有属性/元素
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }

  return clone;
}
```

## WeakSet

### 特性

- 值必须为对象：只能存储对象引用。
- 弱引用：对象的引用不会阻止垃圾回收。
- 不可枚举：无法遍历、获取大小或清空。
- 主要方法：add(value)、has(value)、delete(value)。

```js
const weakSet = new WeakSet();
const obj1 = {};
const obj2 = {};

// 添加对象
weakSet.add(obj1);
weakSet.add(obj2);

// 检查存在性
console.log(weakSet.has(obj1)); // true

// 删除对象
weakSet.delete(obj1);
```

## WeakMap

### 特性

- 键必须为对象：原始值（如字符串、数字）不能作为键。
- 弱引用：键对象的引用不会阻止垃圾回收。
- 不可枚举：无法遍历、获取大小或清空。
- 主要方法：set(key, value)、get(key)、has(key)、delete(key)。

```js
const weakMap = new WeakMap();
const obj = {};

// 设置键值对
weakMap.set(obj, '秘密数据');

// 获取值
console.log(weakMap.get(obj)); // '秘密数据'

// 检查存在性
console.log(weakMap.has(obj)); // true

// 删除键值对
weakMap.delete(obj);
```


## 核心区别

| 特性         | Map/Set                        | WeakMap/WeakSet            |
| ------------ | ------------------------------ | -------------------------- |
| 键/值类型    | 任意类型                       | 仅对象（弱引用）           |
| 枚举性       | 可遍历（`keys()`、`values()`） | 不可遍历                   |
| 大小获取     | `size` 属性                    | 无                         |
| 垃圾回收影响 | 强引用，阻止回收               | 弱引用，不阻止回收         |
| 应用场景     | 常规键值对存储                 | 临时关联数据、避免内存泄漏 |
