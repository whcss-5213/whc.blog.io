# Array

## 创建数组

```js
Array(3).fill(0)// [0,0,0]
Array({}, [], 1) // [{},[],1]
```

### from/of

```js
// from()  把类数组对象或可迭代对象转化为真正的数组，
// 类数组：可迭代的结构，或者有一个 length 属性和可索引元素的结构
const todos = document.querySelectorAll('li'); //Nodelist
const todosArr1 = Array.from(todos)

// 可以传第二参数对转化的数组进行处理(类似map方法)，回调函数
const todosArr2 = Array.from(todos, todo => todo.textContent)


// 字符串会被拆分为单字符数组 字符串也是可迭代的
console.log(Array.from('KFC'))//["K", "F", "C"]

// 对现有数组执行浅复制
let arr1 = [1, 2, 3, 4]
let arr2 = Array.from(arr1)// [1,2,3,4]
arr1 == arr2 //false

// .of()  把传入值转为数组
let of = Array.of(1, 'abc', {})
```

## 空位

ES 6 以后的方法把空位当成存在的元素，值为 `undefined`

ES 6 之前的方法忽略这个空位

1. `forEach()`, `filter()`, `reduce()`, `every()` 和`some()`都会跳过空位
2. `for in` 会忽略空位
3. `for of` / `for` 正常遍历数组 undefined
4. `map` 遍历时会跳过空位但会保留这个值
5. `Array.from`、`扩展运算符`、`with` 空位转为 undefined
6. `sort` 空位被视为 `undefined` 值，并且它们会被排序到数组的末尾。

## 常用方法

- 修改原数组：`pop` `push` `shift` `unshift` `sort` `splice` `reverse` `fill` `copyWithin`
- 返回新数组：`map ` `flat` `concat` `slice` `filter` `copyWithin` `flat` `with`

### 栈方法

> 后进先出（LIFO，Last-In-First-Out）在数组尾部添加 or 删除元素

- In -> push

- Out -> pop

### 队列方法

> 先进先出（FIFO，First-In-First-Out）在数组头部添加 or 删除元素

- In -> unshift

- Out -> shift

### 排序

#### 1.sort

- 默认升序
- Array.sort((a,b) => a-b)
- a - b > 0 => [b,a]
- a - b < 0 => [a,b]

#### 2.reverse

反转数组

### 操作

```js
let colors = ["red", "green", "blue", "yellow", "purple"];
```

#### 1. concat

```js
let colors1 = colors.concat("yellow", ["black", "brown"])
```

#### 2. slice

- 截取数组，接收两个参数
- 第一个参数定义截取开始位置(负值，从数组尾部开始)
- 第二个参数定义截取结束位置的后一个位置（可选，不选截取倒数组结束)
- 返回截取的元素，类型为数组，不改变原数组

```js
let colors2 = colors.slice(1, 4) 
```

#### 3. splice

修改原数组,返回新数组,它包含从数组中被删除的元素（如果没有删除元素,则返
回空数组）

- 删除

```js
// 参数一： 删除位置
// 参数二： 删除数量
colors.slice(1, 2) 
```

- 插入

```js
// 插入 两个元素
colors.slice(1, 0, "yellow", "orange")
```

- 替代

```js
// 删除一个，插入两个
colors.slice(1, 1, 'orange', '#FFF') 
```

### 搜索

- 返回值： `find`
- 返回索引：`indexOf` `lastIndexOf` `findIndex`
- 返回布尔值： `includes`

> 可选参数起始位置（`frommindex`）小于 0 时， 使用 frommindex + array.length。在这种情况下，仍然从前到后搜索数组。

#### 1. indexOf

- 返回要查找的元素在数组中的索引,没找到则返回-1
- 参数：要查找的元素和一个可选的起始搜索位置
- 使用全等（===）比较

```js
[3, 4, 5, 6].indexOf(5, 2)
```

#### 2. lastIndexOf

- 用法同 `indexOf`
- 从数组末尾开始搜索

#### 3. includes

- 一个数组是否包含一个指定的值,返回 `true` of `false`
- 使用零值相等算法将 searchElement 与数组中的元素进行比较
- 参数：要查找的元素和一个可选的起始搜索位置（`fromIndex`）
- fromIndex > 数组长度，直接返回 `false`
- 如果 fromIndex 为负值，计算出的索引将作为开始搜索 searchElement 的位置。如果计算出的索引小于 0，则整个数组都会被搜索。

```js
[1, 2, 3].includes(3, -1); // true
[1, 2, NaN].includes(NaN); // true
[1, , 3].includes(undefined) // true
```

- 在非数组对象上调用 includes() 方法算

```js
// 读取 this 的 length 属性，然后访问每个整数索引
const arrayLike = {
    length: 3,
    0: 2,
    1: 3,
    2: 4,
};
Array.prototype.includes.call(arrayLike, 2)// true
Array.prototype.includes.call(arrayLike, 1)// false
```

#### 4.find

- 返回符合函数的第一个元素的值,否则返回 `undefined`.

```js
const Find = [2, 3, 4, 5].find((element, index, array) => {
    // element 前正在处理的元素
    // index 正在处理的元素在数组中的索引
    // array 调用了 find() 的数组本身
    return element > 3
}) // 4
```

#### 5.findIndex

- 同`find`,返回符合函数的第一个元素的值的索引.

### 迭代

#### 1. every

对数组每一项都运行传入的函数，如果对每一项函数都返回 true，则这个方法返回 true。

#### 2. filter

对数组每一项都运行传入的函数，函数返回 true 的项会组成数组之后返回。

#### 3. forEach

对数组每一项都运行传入的函数，没有返回值。

#### 4. map

对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组。

#### 5. some

对数组每一项都运行传入的函数，如果有一项函数返回 true，则这个方法返回 true。

### 归并

#### 1. reduce

从数组第一项开始遍历到最后一项

```js
// 归并函数 归并初始值
[].reduce((pre, element, index, array) => {
    // 上一个归并值、当前项、当前项的索引和数组本身 
    return pre
}, {})
   ```

#### 2. reduceRight

用法同 `reduce` ,从最后一项开始遍历至第一项

### 复制填充

#### 1.copyWithin

浅复制指定范围数组中的部分内容，然后将它们插入到指定索引开始的位置

返回新数组，新数组和原数组长度一致，不修改原数组

```js
arr.copyWithin(target, start, end)
// 插入位置索引 复制元素的起始位置 复制元素的结束位置(不包含该元素)
    [1, 2, 3, 4, 5, 6].copyWithin(1, 2, 5) // [1, 3, 4, 5, 5, 6]
//  插入位置索引
//  从索引 0 开始复制
    [1, 2, 3, 4, 5, 6].copyWithin(2) // [1, 2, 1, 2, 3, 4]
// 插入位置索引 复制元素的起始位置
// 从索引 2 开始复制，从索引 0 开始插入
    [1, 2, 3, 4, 5, 6].copyWithin(0, 2) // [3, 4, 5, 6, 5, 6]
```

#### 2.fill

向一个已有的数组中插入全部或部分相同的值，会修改原数组

```js
// 填充值 起始位置 结束位置(不包含该元素)
[1, 2, 3, 4, 5, 6].fill(1, 2, 5)// [1, 2, 1, 1, 1, 6]
// 填充值
    [1, 2, 3, 4, 5, 6].fill(1) // [1, 1, 1, 1, 1, 1]
// 填充值  起始位置
    [1, 2, 3, 4, 5, 6].fill(1, 3)
```

### 转换

> 如果数组中某一项是 null 或 undefined，则在 join()、toLocaleString()、 toString()和 valueOf()返回的结果中会以空字符串表示。

#### 1.toString

都会调用数组的每个值的`toString()`方法，返回由数组中每个值的等效字符串拼接而成的一个逗号分隔的字符串。

#### 2.valueOf

返回的还是数组本身

#### 3.join

```js
let colors = ["red", "green", "blue"]
colors.join(",") // red,green,blue 
colors.join("||") // red||green||blue 
```

### ES 6+

#### 1.flat

创建一个新的数组，并根据指定深度递归地将所有子数组元素拼接到新的数组中。

- 可选的 `depth` 参数，表示要扁平化的层级深度
- 如果没有提供 `depth` 参数，则默认为 1。
- flat(`Infinity`) 完全扁平化一个数组
- 属于复制方法。它不会改变原数组，而是返回一个浅拷贝。
- 忽略空位

#### 2.flatMap

它等价于在调用 map() 方法后再调用深度为 1 的 flat() 方法

```js
const poets = [
    {name: '李白', poems: ['静夜思', '将进酒', '望庐山瀑布']},
    {name: '杜甫', poems: ['月夜忆舍弟', '登高', '秋夜将晓出篱门迎凉有感']},
    {name: '苏轼', poems: ['江城子·密州出猎', '赤壁赋', '水调歌头·明月几时有']}
];

poets.flatMap(poet => poet.poems);
['静夜思', '将进酒', '望庐山瀑布', '月夜忆舍弟', '登高', '秋夜将晓出篱门迎凉有感', '江城子·密州出猎', '赤壁赋', '水调歌头·明月几时有']
```

#### 3.with

替换指定位置的值

- 返回新数组，不修改原数组
- 相当于 Array[2] = 'new value'
- 空位会转化为 `undefined`
- 参数：替换值索引,默认 0； new value，默认值 undefined

```js
[1, 2].with()//[undefined,2] 
    [1, 2].with(1)//[1,undefined] 
    [1, 2].with(1, 3)//[1,3]
```

#### 4.at

返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数。
索引的绝对值大于数组`length`，返回 `undefined`

```js
[0, 1, 2, 3, 4].at(2) // 1
    [0, 1, 2, 3, 4].at(-1) // 4
    [0, 1, 2, 3, 4].at(-6) // undefined

```

## 检测数组

```js
typeof [] === typeof {} // true
Object.prototype.toString.call({}).slice(8, -1) // Object
Object.prototype.toString.call([]).slice(8, -1) // Array
Array.isArray({}) // false
Array.isArray([]) // true
```

## 清空数组

```js
let a = [1, 2, 3]
let b = a
```

1. a = []

- a指向新的空数组,被清空,b指向原先的数组,没被清空.

2. a.length = 0

- a,b都被清空