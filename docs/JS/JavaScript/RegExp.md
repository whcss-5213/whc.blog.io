# RegExp

> [JavaScript Regular Expression Visualizer](https://jex.im/regulex)

> [正则大全](https://any86.github.io/any-rule/)

## 表达式修饰符

### 1.特殊字符

|     字符     |        涵义         |
|:----------:|:-----------------:|
|     \d     |        数字         |
|     \D     |    \d的补集,包括空格     |
|     \w     | 阿拉伯数字、英文字母大小写和下划线 |
|     \W     |      \w 的补集       |
|     \s     | 匹配空白字符，如空格，换行，制表符 |
|     \S     |       \s 补集       |
|     .      |     除换行外的任意字符     |
|   \[...]   |     匹配集合内任意元素     |
|  \[^...]   |        取反         |
|    \{2}    |       匹配个数        |
|    ^/$     |       开头/结尾       |
|     \b     |       单词边界        |
|     \B     |       非单词边界       |
|     +      |    至少一次 \{1,}     |
|     *      |     任意次数\{0,}     |
|     ?      |   零次或一次 \{0,1}    |
| \n  \f  \r |    换行符 换页符 回车符    |
|   \t  \v   |     水平/垂直制表符      |

### 2.flags

```js
let reg1 = / /g  //全局匹配
let reg2 = / /i  //忽略大小写
let reg3 = / /gi //全局匹配and忽略大小写
let reg4 = / /m  //多行搜索。   /gm
let reg5 = / /u   //使用unicode码的模式进行匹配。
const reg6 = / /y  // 粘滞匹配
/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
```

> [JavaScript:正则表达式的/y标识](https://www.cnblogs.com/ziyunfei/archive/2012/12/07/2807313.html)

## 正则方法

|   方法	    |                           描述                            |
|:--------:|:-------------------------------------------------------:|
|  exec	   |     一个在字符串中执行查找匹配的 RegExp 方法，它返回一个数组（未匹配到则返回 null）。     |   
|  test	   |       一个在字符串中测试是否匹配的 RegExp 方法，它返回 true 或 false。        |
|  match	  |    一个在字符串中执行查找匹配的 String 方法，它返回一个数组，在未匹配到时会返回 null。     |  
| matchAll |     	一个在字符串中执行查找所有匹配的 String 方法，它返回一个迭代器（iterator）。     | 
|  search  |    	一个在字符串中测试匹配的 String 方法，它返回匹配到的位置索引，或者在失败时返回 -1。     |  
| replace  |     	一个在字符串中执行查找匹配的 String 方法，并且使用替换字符串替换掉匹配到的子字符串。     |
|  split   | 	一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的 String 方法。 |

## 原子组(捕获组)

### 1.原子组

- 一对()是一组
- 从左向右数左括号
- \1 表示复用用前面第一个原子组,\2 复用第二个

```js
let ad = 'abdasdfdsfh4ab'
let reg = /(ab)([\s\S]*)\1/gi  // (ab) 原子组
ad.match(reg)

let whc = '<h1>whcss.xyz</h1>'
let reg = /<(h[1-6])>([\s\S]+)<\/\1>/gi

whc.replace(reg, `<p>$2</p>`)   // $1 第一组 ，$2 第二组 ，

whc.replace(reg, (p0, p1, p2) => {   // 第一个参数：匹配到的字符串，第二个参数：第一组，
    return `<p>${p2}</p>`			//第三个参数 ：第二组
})
```

### 2.原子组别名 ?<>

```js
reg1 = /(\w.?<first>(?<second>))(?<third>)/
date.replace(/(?<month>\d{2})-(?<day>\d{2})-(?<year>\d{4})/,
    "$<day>-$<month>-$<year>")
```

### 3.特殊原子组(断言)

- (?:X)：匹配 'x' 但是不记住匹配项,非获取匹配。

- X(?=Y)：匹配'x'仅仅当'x'后面跟着'y'.这种叫做先行断言。

- (?<=Y)X ：匹配'x'仅仅当'x'前面是'y'.这种叫做后行断言。

- X(?!Y) : 仅仅当'x'后面不跟着'y'时匹配'x'，这被称为正向否定查找 。

- (?<!Y)X ：仅仅当'x'前面不是'y'时匹配'x'，这被称为反向否定查找。

```js
let whc = 'https://www.whcss.xyz http://baidu.com'
// 虽然有三个组但有 ?: ，其他两个没选中，只选中一个。
let reg = /https?:\/\/((?:\w+\.)?\w+\.(?:xyz|com|cn|org))/gi
let urls = []
while ((res = reg.exec(whc))) {
    urls.push(res1)
}
```