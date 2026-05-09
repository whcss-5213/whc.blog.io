# CSS 选择器

## 一、基础选择器

### 1. 标签选择器

选择指定的 HTML 标签元素。

```html
<p>123313</p>
```

```css
p {
    color: red;
}
```

### 2. ID 选择器

通过元素的 `id` 属性选择，ID 在页面中应该是唯一的。

```html
<p id="one">123313</p>
```

```css
#one {
    color: red;
}
```

### 3. Class 选择器

通过元素的 `class` 属性选择，一个元素可以有多个 class。

```html
<p class="two">123313</p>
```

```css
.two {
    color: red;
}
```

### 4. 通配符选择器 (*)

选择所有 HTML 标签元素。

```css
* {
    padding: 0;
    margin: 0;
}
```

---

## 二、组合选择器

### 5. 后代选择器（空格）

选择所有的后代子元素，包括子元素、孙元素等。

```html
<div class="abc">
    <div></div>
    <div></div>
</div>
```

```css
.abc div {
    width: 100px;
}
```

### 6. 子元素选择器 (>)

只选取第一层的直接子元素，子元素里的子元素不会被选取。

```html
<div class="abc">
    <div></div>  /* 被选中 */
    <div></div>  /* 被选中 */
    <div>
        <div></div>  /* 不会被选中 */
    </div>
</div>
```

```css
.abc > div {
    width: 100px;
}
```

### 7. 相邻兄弟选择器 (+)

选择紧贴着的第一个兄弟元素，中间不能有任何其他元素。

```html
<div>
    <div class="abc">
        <div></div>
    </div>
    <div></div>  /* 选择的是这个 */
    <div></div>
</div>
```

```css
.abc + div {
    width: 100px;
}
```

### 8. 通用兄弟选择器 (~)

选择所有后续的兄弟元素。

```html
<div>
    <div class="abc">
        <div></div>
    </div>
    <div></div>  /* 被选中 */
    <div></div>  /* 被选中 */
</div>
```

```css
.abc ~ div {
    width: 100px;
}
```

### 9. 列组合器 (||)

用于选择表格列中的单元格。

```css
col.selected || td {
    background: gray;
}
```

---

## 三、属性选择器

### 10. 基础属性选择器

```html
<a href="http://www.baidu.com" title="百度"></a>
<div class="abc-1"></div>
<div class="abc-2"></div>
```

```css
/* 具有 title 属性的元素 */
a[title] { }

/* title 等于"百度"的元素 */
a[title="百度"] { }
```

### 11. 属性值匹配选择器

```css
/* 以 abc 开头的元素 */
div[class^="abc"] { }

/* 以 abc 结尾的元素 */
div[class$="abc"] { }

/* 包含 abc 的元素 */
div[class*="abc"] { }

/* 包含特定值（以空格分隔的词列表中） */
[class~="active"] { }

/* 等于 value 或以 value- 开头 */
[attr|="value"] { }

/* 不区分大小写匹配（i 标志） */
a[href$=".pdf" i] { }
```

---

## 四、结构伪类选择器

### 12. :first-child 和 :first-of-type

```html
<div class="nth">
    <div></div>
    <header></header>
    <div></div>
    <div></div>
</div>
```

```css
/* 选择不到，因为第一个子元素不是 header */
.nth header:first-child { }

/* 能选到，选择到第一个 header 标签 */
.nth header:first-of-type { }

/* 选择不到，因为第二个子元素不是 div */
.nth div:nth-child(2) { }

/* 能选到，选择到第二个 div 标签 */
.nth div:nth-of-type(2) { }
```

**区别：**
- `-child`：按照子元素的顺序进行筛选
- `-of-type`：先按照子元素的类型分类，再按照同类型标签的顺序进行筛选

### 13. 其他结构伪类

```css
/* 最后一个子元素 */
:last-child

/* 最后一个同类型元素 */
:last-of-type

/* 唯一子元素 */
:only-child

/* 唯一同类型元素 */
:only-of-type

/* 倒数第 n 个子元素 */
:nth-last-child(n)

/* 倒数第 n 个同类型元素 */
:nth-last-of-type(n)
```

### 14. 常用公式

```css
/* 偶数 */
:nth-child(even)
:nth-of-type(even)

/* 奇数 */
:nth-child(odd)
:nth-of-type(odd)

/* 从第五个到最后 */
:nth-child(n+5)
:nth-of-type(n+5)

/* 前六个 */
:nth-child(-n+6)
:nth-of-type(-n+6)

/* 每3个选一个（3, 6, 9...） */
:nth-child(3n)
```

---

## 五、状态伪类选择器

### 15. 链接状态

```css
/* 未访问的链接 */
:link { }

/* 已访问的链接 */
:visited { }

/* 鼠标悬浮 */
:hover { }

/* 被激活（鼠标按下时） */
:active { }

/* 任何链接（:link 或 :visited） */
:any-link { }

/* 本地链接（同域名） */
:local-link { }
```

### 16. 焦点状态

```css
/* 元素获得焦点 */
:focus { }

/* 焦点可见（键盘导航时） */
:focus-visible { }

/* 焦点在元素或其任意后代元素 */
:focus-within { }
```

### 17. 目标伪类

```css
/* URL 哈希指向的元素 */
:target {
    background: yellow;
}
```

### 18. 空元素选择器

```css
/* 选择没有任何子元素（包括文本节点）的元素 */
:empty {
    display: none;
}
```

### 19. 否定伪类

```css
/* 选择所有不是 p 的元素 */
:not(p) {
    color: red;
}

/* 选择没有 class 的 div */
div:not([class]) {
    border: 1px solid black;
}

/* 多个条件链式使用 */
input:not([type="submit"]):not([type="reset"]) {
    background: #f0f0f0;
}
```

---

## 六、表单相关伪类

### 20. 表单状态

| 选择器 | 说明 |
|--------|------|
| `:enabled` | 启用的表单元素 |
| `:disabled` | 禁用的表单元素 |
| `:checked` | 被选中的 checkbox/radio |
| `:indeterminate` | 状态不确定的 checkbox |
| `:default` | 默认选中的元素 |

### 21. 验证状态

| 选择器 | 说明 |
|--------|------|
| `:valid` | 验证通过的表单元素 |
| `:invalid` | 验证失败的表单元素 |
| `:in-range` | 值在范围内的 number 元素 |
| `:out-of-range` | 值超出范围的 number 元素 |
| `:required` | 必填的表单元素 |
| `:optional` | 可选的表单元素 |
| `:read-only` | 只读的表单元素 |
| `:read-write` | 可读写的表单元素 |
| `:placeholder-shown` | placeholder 显示的输入框 |

**示例：**

```css
/* 禁用状态样式 */
input:disabled {
    background: #eee;
    cursor: not-allowed;
}

/* 验证失败样式 */
input:invalid {
    border-color: red;
}

/* placeholder 显示时的样式 */
input:placeholder-shown {
    font-style: italic;
}

/* 表单验证实用样式 */
input:invalid:not(:placeholder-shown) {
    border-color: red;
}

input:valid:not(:placeholder-shown) {
    border-color: green;
}
```

---

## 七、其他伪类选择器

### 22. 语言和方向

```css
/* 文本方向 */
:dir(ltr) { }
:dir(rtl) { }

/* 语言 */
:lang(zh-CN) { }
:lang(en) { }
```

### 23. 全屏和模态

```css
/* 全屏模式的元素 */
:fullscreen { }

/* 模态对话框 */
:modal { }
```

### 24. 媒体相关

```css
/* 当前播放的元素 */
:current { }

/* 静音的媒体元素 */
:muted { }

/* 正在缓冲的媒体元素 */
:buffering { }

/* 停滞的媒体元素 */
:stalled { }
```

### 25. 其他

```css
/* 已定义的自定义元素 */
:defined { }

/* 用于字幕的未来/过去元素 */
:future { }
:past { }
```

---

## 八、现代伪类函数

### 26. :is() - 匹配任意

以选择器列表作为参数，匹配其中任意一个，简化复杂的选择器书写。

```css
/* 传统写法 */
header h1, header h2, header h3,
article h1, article h2, article h3,
aside h1, aside h2, aside h3 {
    color: red;
}

/* 使用 :is() 简化 */
:is(header, article, aside) :is(h1, h2, h3) {
    color: red;
}
```

**特点：**
- 优先级取参数中最高的那个
- 容错解析：即使其中某个选择器无效，其他有效的选择器仍然生效

### 27. :where() - 零优先级匹配

与 `:is()` 语法相同，但优先级始终为 0。

```css
:where(header, article, aside) h1 {
    color: red; /* 优先级 = 0 + h1 的优先级 */
}
```

**用途：** 便于覆盖样式，适合写基础样式库或重置样式。

**对比示例：**

```css
/* :is() 优先级较高 */
:is(.class) p { color: red; }  /* 优先级: (0,1,1) */

/* :where() 优先级为 0 */
:where(.class) p { color: blue; }  /* 优先级: (0,0,1) */

/* 后面的简单选择器可以覆盖 :where() */
article p { color: green; }  /* 优先级: (0,0,2)，会生效 */
```

### 28. :has() - 父元素选择器

选择包含特定子元素的父元素（2022+ 浏览器支持）。

```css
/* 选择包含 img 的 section */
section:has(img) {
    border: 2px solid blue;
}

/* 选择紧跟 h2 的 h1 */
h1:has(+ h2) {
    margin-bottom: 0;
}

/* 选择没有子元素的 div */
div:not(:has(*)) {
    background: yellow;
}

/* 选择包含特定类名的父元素 */
.card:has(.featured) {
    grid-column: span 2;
}

/* 选择有多个子元素的容器的第一个子元素 */
.parent:has(> :nth-child(2)) > :first-child {
    font-weight: bold;
}
```

**限制：**
- 不能嵌套使用 `:has(:has(...))`
- 伪元素不能作为 `:has()` 的参数
- 性能考虑：复杂的选择器可能影响渲染性能

---

## 九、伪元素选择器

### 29. ::before 和 ::after

```css
/* 必须有 content 属性，可以在 content 里放字体图标 */
/* 是行内元素，一般需要加 display:block */
/* 通常需要定位 */

::before {
    content: '';
}

::after {
    content: '';
}
```

### 30. 文本相关伪元素

```css
/* 第一个字母 */
::first-letter {
    font-size: 2em;
    color: red;
}

/* 第一行 */
::first-line {
    font-weight: bold;
}

/* 选中的文本 */
::selection {
    background: yellow;
    color: black;
}
```

### 31. 表单相关伪元素

```css
/* placeholder 文字 */
::placeholder {
    color: gray;
}

/* 输入光标 */
::caret {
    color: red;
}

/* 文件上传按钮 */
::file-selector-button {
    background: blue;
    color: white;
}
```

### 32. 其他伪元素

```css
/* 列表标记 */
::marker {
    color: red;
    font-size: 1.2em;
}
```

**实用示例：**

```css
/* 首字下沉效果 */
p::first-letter {
    float: left;
    font-size: 3em;
    line-height: 1;
    margin-right: 0.1em;
}

/* 自定义选中文本样式 */
::selection {
    background: #007bff;
    color: white;
}

/* 美化文件上传按钮 */
input[type="file"]::file-selector-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
}

/* 清除浮动 */
.clearfix::after {
    content: '';
    display: block;
    clear: both;
}
```

---

## 十、选择器优先级

### 33. 优先级计算模型

CSS 优先级使用 (a, b, c, d) 四元组表示：

| 选择器类型 | 优先级 |
|-----------|--------|
| 内联样式 | (1,0,0,0) |
| ID 选择器 | (0,1,0,0) |
| 类、伪类、属性选择器 | (0,0,1,0) |
| 标签、伪元素选择器 | (0,0,0,1) |
| `*`、组合器 (`>`, `+`, `~`, 空格) | (0,0,0,0) |
| `:where()` | (0,0,0,0) |
| `:not()`、`:is()`、`:has()` | 取参数中最高的 |

### 34. 计算示例

```css
/* (0,0,1,1) - 1个类 + 1个标签 */
div.class { }

/* (0,1,0,1) - 1个ID + 1个标签 */
div#id { }

/* (0,1,2,1) - 1个ID + 2个类 + 1个标签 */
div#id.class1.class2 { }

/* (0,0,0,0) - 优先级为 0 */
:where(.class) { }

/* (0,1,0,0) - 取 :is() 中最高的 #id */
:is(.class, #id) { }
```

### 35. 比较规则

1. 从左到右比较，a 大的优先级高
2. a 相同则比较 b，以此类推
3. `!important` 覆盖所有优先级计算

```css
/* 示例比较 */
#nav .menu { }      /* (0,1,1,0) */
.nav .menu li { }   /* (0,0,2,1) */
/* 第一个优先级更高 */
```

### 36. 描述准确性

```html
<div id="d1">
    <p>1</p>
</div>
```

```css
#d1 {
    color: red;
}

p {
    color: blue; /* blue 生效，因为描述更加准确 */
}

#d1 p {
    /* 更精确的描述，会覆盖上面的样式 */
}
```

---

## 十一、实用技巧

### 37. 选择器性能优化

- **避免过深的选择器嵌套**（建议最多 3-4 层）
- **避免使用 `*` 作为关键选择器**
- **优先使用类选择器而非标签选择器**
- **右侧关键选择器尽量具体**

```css
/* 不推荐 - 性能差 */
body div ul li a { }

/* 推荐 */
.nav-link { }
```

### 38. 常用组合技巧

```css
/* 图片未加载时的占位 */
img:not([src]) {
    visibility: hidden;
}

/* 禁用状态的样式统一 */
:disabled,
[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 隐藏空元素 */
:empty {
    display: none;
}

/* 平滑滚动到锚点 */
:target {
    scroll-margin-top: 80px;
    animation: highlight 2s ease;
}

@keyframes highlight {
    from { background: yellow; }
    to { background: transparent; }
}
```

### 39. 现代 CSS 实用模式

```css
/* 容器查询配合 :has() */
.card:has(.featured) {
    grid-column: span 2;
}

/* 暗黑模式检测 */
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #1a1a1a;
        --text: #ffffff;
    }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* 打印样式 */
@media print {
    :is(nav, aside, footer) {
        display: none;
    }
}
```

### 40. 复杂选择器示例

```css
/* 选择表格中除了表头外的奇数行 */
table tbody tr:nth-child(odd):not(:first-child) {
    background: #f5f5f5;
}

/* 选择相邻的相同标签 */
h2:has(+ h2) {
    margin-bottom: 0.5em;
}

/* 自定义 checkbox 样式 */
input[type="checkbox"]:checked + label::before {
    content: '✓';
    background: blue;
    color: white;
}

/* 选择有图片的卡片并添加特殊样式 */
.card:has(img) {
    border: 2px solid #007bff;
}

/* 多条件表单验证样式 */
input:required:invalid:not(:placeholder-shown) {
    border-color: red;
    background-color: #ffe6e6;
}
```

---

## 浏览器兼容性说明

| 选择器 | 浏览器支持 |
|--------|-----------|
| 基础选择器 | 所有现代浏览器 |
| 属性选择器 | IE7+ |
| 结构伪类 | IE9+ |
| `:not()` | IE9+ |
| `:is()`、`:where()` | Chrome 88+, Firefox 78+, Safari 14+ |
| `:has()` | Chrome 105+, Firefox 121+, Safari 15.4+ |
| `:focus-visible` | Chrome 86+, Firefox 85+, Safari 15.4+ |
| `::file-selector-button` | Chrome 89+, Firefox 91+, Safari 15.4+ |
| `::marker` | Chrome 86+, Firefox 68+, Safari 11.1+ |
