# Sting

> String 以 UTF-16 编码存储
>
> - 基本多语言平面（BMP）字符：Unicode 码点范围 U+0000 到 U+FFFF，用一个代码单元表示。
> - 辅助平面字符：码点范围 U+10000 到 U+10FFFF，用两个代码单元（称为代理对）表示。
> - 例如，表情符号 😊 的 Unicode 码点是 U+1F60A，在 UTF-16 中被编码为两个代码单元：0xD83D 和 0xDE0A。

## 字符串字符访问与编码方法

### 1. `charAt(index)`

- **定义**：返回字符串中指定位置的字符（一个字符串）。
- **语法**：`str.charAt(index)`
- **参数**：`index` —— 一个整数，表示字符的位置（从 0 开始）。如果省略，默认为 0。
- **返回值**：
  - 返回指定位置的字符（长度为 1 的字符串）。
  - 如果 `index` 超出范围（小于 0 或大于等于字符串长度），返回空字符串 `''`。
- **示例**：
  ```javascript
  const str = 'Hello 世界';
  console.log(str.charAt(0)); // "H"
  console.log(str.charAt(6)); // "世"
  console.log(str.charAt(20)); // ""
  ```
- **注意**：
  - 与方括号 `str[index]` 类似，但越界时返回 `''` 而不是 `undefined`。
  - 对于辅助平面字符（如表情符号），`charAt` 返回的是半个代码单元，可能不完整。

### 2. `charCodeAt(index)`

- **定义**：返回字符串中指定位置的字符的 UTF-16 代码单元值（一个 16 位整数）。
- **语法**：`str.charCodeAt(index)`
- **参数**：`index` —— 字符位置，默认 0。
- **返回值**：
  - 返回 0 到 65535 之间的整数，表示该字符的 UTF-16 代码单元值。
  - 如果 `index` 超出范围，返回 `NaN`。
- **示例**：
  ```javascript
  const str = 'Hello 世界';
  console.log(str.charCodeAt(0)); // 72
  console.log(str.charCodeAt(6)); // 19990
  console.log(str.charCodeAt(20)); // NaN
  ```
- **注意**：
  - 对于辅助平面字符（Unicode 码点 > 0xFFFF），它只能返回高代理项或低代理项，不能表示完整字符。
  - 与 `String.fromCharCode()` 配合可反向转换。

### 3. `codePointAt(index)`

- **定义**：返回字符串中指定位置的字符的完整 Unicode 码点（一个非负整数）。
- **语法**：`str.codePointAt(index)`
- **参数**：`index` —— 字符位置，默认 0。
- **返回值**：
  - 返回一个整数，表示该字符的 Unicode 码点（0 到 0x10FFFF）。
  - 如果 `index` 超出范围，返回 `undefined`。
  - 如果指定位置是代理对的高代理项，则返回完整的码点；如果是低代理项，则返回低代理项的数值（但通常不应这样用）。
- **示例**：
  ```javascript
  const emoji = '😊';
  console.log(emoji.charCodeAt(0)); // 55357 (高代理项)
  console.log(emoji.charCodeAt(1)); // 56842 (低代理项)
  console.log(emoji.codePointAt(0)); // 128522 (完整码点)
  console.log(emoji.codePointAt(1)); // 56842 (低代理项本身)
  ```
- **注意**：
  - 正确处理代理对，返回完整的 Unicode 码点，适合处理所有 Unicode 字符。
  - 与 `String.fromCodePoint()` 配合使用。

---

### 对比总结

| 方法                 | 返回值类型 | 范围                   | 处理代理对          | 越界行为    |
| -------------------- | ---------- | ---------------------- | ------------------- | ----------- |
| `charAt(index)`      | 字符串     | 单个字符（可能不完整） | ❌ 返回半个字符     | `''`        |
| `charCodeAt(index)`  | 数字       | 0–65535（代码单元）    | ❌ 返回单个代码单元 | `NaN`       |
| `codePointAt(index)` | 数字       | 0–0x10FFFF（完整码点） | ✅ 返回完整码点     | `undefined` |

### 补充说明

- 若要安全遍历所有字符（包括辅助平面），使用 `for...of` 或扩展运算符：
  ```javascript
  const text = 'Hello 😊';
  for (const ch of text) {
    console.log(ch); // 依次输出每个完整字符
  }
  ```
- 若需从码点创建字符串，使用 `String.fromCodePoint()`，而不是 `String.fromCharCode()`。

## length

```js
const str = '🎇🎍🎁';
str.length; // 6
str.split('');
//  ['\uD83C', '\uDF87', '\uD83C', '\uDF8D', '\uD83C', '\uDF81']
```

### [...str]

- 可以将字符串转换为数组
- 每个字符作为数组的一个元素

```js
[...str].length; // 3
```

### Intl.Segmenter

- 用于将字符串按照 Unicode 标准的规则进行分段
- 可以处理辅助平面字符（如表情符号）

```js
Array.from(new Intl.Segmenter('en-US').segment(str)).length; // 3
```

## 常用方法

- 可以用正则的方法：**match**、**replace**、**search** 和 **split**

### 操作

#### 1.concat

- 连接字符串，返回新字符串，不改变原字符串。
- 不是字符串的，先转化为字符串，在连接

```js
let Concat1 = str1.concat(str2);
let Concat2 = str1.concat('123');
```

#### 2.slice

- 提取部分字符串
- 两个参数 起始位置 结束位置（不包含该位置的值）
- 默认从 **0** 开始
- 参数为负数时，代表从字符串尾部计算结束位置
- 省略第二个参数，会截取剩下的全部字符串

```js
let Slice = str1.slice(1, 2);
```

#### 3.substring

- 用法和 slice 相同，不过无法接受负数作为参数

```js
let Substring = str1.substring(1, 2);
```

#### 4.substr

::: warning 提示
不再推荐使用该特性
:::

- 用法和 slice 相同
- 第二个参数含义不同，第二参数代表截取的长度
- 省略第二个参数，会截取剩下的全部字符串

```js
let Substr = str1.substr(0, 2);
```

#### 5.trim

- 去除两端空格（\t,\w,\n,\r）
- 返回新字符串，不改变原字符串
- trimStart 去除头部空格
- trimEnd 去除尾部空格

```js
let Trim = str1.trim();
```

#### 6.toUpperCase/toLowerCase

- 转换大小写
- 返回新字符串，不改变原字符串

```js
let ToUpperCase = str1.toUpperCase(); // 转成大写
let ToLowerCase = str1.toLowerCase(); // 转成小写
```

### 位置

#### 1.indexOf

- 查找字符串
- 从头到尾开始查找，参数 2 代表开始位置
- 返回字符串中指定文本首次出现的索引（位置）
- 从 0 开始
- 找不到返回-1

```js
let IndexOf = str1.indexOf('b', 1);
```

#### 2.lastIndexOf

- 从尾到头开始查找，参数 2 代表开始位置
- 返回指定文本在字符串中最后一次出现的索引
- 找不到返回-1

```js
let LastIndexOf = str1.lastIndexOf('b', 1);
```

### 包含

#### 1.includes

- 是否包含某字符，包含返回 true，否则返回 false
- 参数 2 代表开始位置

```js
let Includes = str1.includes('b', 1);
```

#### 2.startsWith/endsWith

- 判断字符串是否以指定内容开始/结束
- 接受两个参数，参数 1 指定内容，参数 2 指定内容起始位置（可选）
- 返回布尔值

```js
'123abc'.startsWith('1');
'123abc'.endsWith('c');
```

### 模式匹配

> 可以使用正则表达

#### 1.match

- 在字符串内找到相应的值并返回这些值(不是索引)
- 返回值
  - 如果使用 g 标志，则将返回与完整正则表达式匹配的所有结果
  - 如果没有使用 g 标志，则只返回第一个完整匹配及其相关捕获组

```js
let Match = str1.match('b');
```

#### 2.search

- 搜索特定值的字符串，并返回匹配的索引
- 没找到则返回-1

```js
let Search = str1.search('c');
```

#### 3.replace

> [js replace 方法第二个参数，远不止你想的那么强大](https:www.cnblogs.com/garfieldzhong/p/11654630.html)

- 接受两个参数，把参数 1 替换成参数 2
- 返回一个新字符串
- 参数 1 可以为正则表达式。参数 2 可以为函数

```js
let Replace = str1.replace('d', 'hjjkl');
```

| 模式 |                             插入值                              |
| :--: | :-------------------------------------------------------------: |
|  $$  |                         插入一个 "$"。                          |
|  $&  |                      插入匹配的子字符串。                       |
|  $`  |               插入匹配子字符串之前的字符串片段。                |
|  $'  |               插入匹配子字符串之后的字符串片段。                |
|  $n  | 插入第 n（索引从 1 开始）个捕获组，其中 n 是小于 100 的正整数。 |
|  $   |                 插入名称为 Name 的命名捕获组。                  |

```js
'foo'.replace(/(f)/, '$2');
// "$2oo"；正则表达式没有第二个组

'foo'.replace('f', '$1');
// "$1oo"；pattern 是一个字符串，所以它没有任何组

'foo'.replace(/(f)|(g)/, '$2');
// "oo"；第二个组存在但未匹配
```

#### 4.replaceAll

- 返回一个新字符串,匹配部分都被替换

```js
// 正则必须设置全局（g）标志
'23asd'.replaceAll(/a/g);
// 如果 pattern 是一个空字符串，则替换内容将插入到每个 UTF-16 码元之间
'xxx'.replaceAll('', '_'); // "_x_x_x_"
```

#### 5.split

- 把符串组分割成数组,返回新数组,不改变原字符串
- 可以接受两个参数，参数 1 分割符（可以为正则） 参数 2 返回数组的最大长度
- 可以使用正则

```js
let str3 = 'a1a2a3';
let Split = str3.split(); // ["a1a2a3"]
let Split2 = str3.split(''); // ["a","1","a","2","a","3"]
let Split3 = str3.split('a', 4); // ["", "1", "2", "3"]
```

### 填充

#### 1.repeat

- 接受一个参数，参数为小数时，取整
- 把字符串重复 n 次后，返回一个新字符串，不改变原字符串

```js
let Repeat = str3.repeat(5);
```

#### 2.padStart/padEnd

- 从 padStart 头部填充， padEnd 从尾部填充
- 接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串
- 如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串。
- 如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。
- 如果省略第二个参数，默认使用空格补全长度。
- 返回新字符串，不改变原字符串

```js
let PadStart = str1.padStart(11, '0');
```

### ES 6+

#### 1.at

- 返回指定位置的字符
- 接受一个参数，参数 1 指定位置,可以为负数
- 返回指定位置的字符

```js
'123abc'.at(0);
'123abc'.at(-1);
```
