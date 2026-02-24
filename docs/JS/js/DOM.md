# DOM

> Document Object Model

## 1.节点

### 1. 节点类型

**nodeType**

nodeType 属性返回节点类型的常数值。不同的类型对应不同的常数值，12 种类型分别对应 1 到 12 的常数值

**nodeName**

nodeName 属性返回节点的名称

**nodeValue**

nodeValue 属性返回或设置当前节点的值，格式为字符串

| Attr                  | value of attribute                  |
| :-------------------- | :---------------------------------- |
| CDATASection          | content of the CDATA Section        |
| Comment               | 注释内容，不包含注释符号 <!-- -->   |
| Document              | null                                |
| DocumentFragment      | null                                |
| DocumentType          | null                                |
| Element               | null                                |
| EntityReference       | null                                |
| Notation              | null                                |
| ProcessingInstruction | entire content excluding the target |
| Text                  | 节点内容                            |

**1.元素节点**

**Node.ELEMENT_NODE (1)**

元素节点 element 对应网页的 HTML 标签元素元素节点的节点类型 nodeType 值是 1，节点名称 nodeName 值是大写的标签名，nodeValue 值是 null。

**2.特性节点**

**Node.ATTRIBUTE_NODE (2)**
特性节点 attribute 对应网页种 HTML 标签的属性，它只存在在元素的 attribute 属性中，并不是 DOM 文档树的一部分，特性节点的节点类型 nodeType 值是 2，节点名称 nodeName 值是属性名，nodeValue 值是属性值。

**3.文本节点**
**Node.TEXT_NODE (3)**

文本节点 text 代表网页中的 HTML 标签内容。文本节点的节点类型 nodeType 值是 3，节点名称 nodeName 值是'#text'
，nodeValue 值是标签内容值。

**4.CDATA 节点**

**Node.CDATA_SECTION_NODE (4)**

CDATASection 类型只针对 XML 的文档，只出现在 XML 文档中。该类型节点的节点类型 nodeType 的值为 4，节点名称 nodeName 的值为'#cdata-section'
，nodevalue 的值是 CDATA 区域中的内容。

**5.实体引用名称节点**

**Node.ENTITY_REFERENCE_NODE (5)**

实体是一个声明，指定了在 XML 中取代内容或标记而使用的名称，在实体声明中定义的名称将在 XML
中使用。 在 XML 中使用时，该名称称为实体引用。实体引用名称节点 entry_reference 的节点类型 nodeType 的值为 5，节点名称 nodeName 的值为实体引用的名称，nodeValue 的值为 null。

**6.实体名称节点**

**Node.ENTITY_NODE (6)**

使用实体声明将名称绑定到替换内容。 实体声明是使用 <!ENTITY name "value"> 语法在文档类型定义(DTD)
或 XML 架构中创建的。实体名称节点类型 nodeType 的值为 6，节点名称 nodeName 的值为实体名称，nodeValue 的值为 null。

**7.处理指令节点**

**Node.PROCESSING_INSTRUCTION_NODE (7)**

处理指令节点 ProcessingInstruction 的节点类型 nodeType 的值为 7，节点名称 nodeName 的值为 target，nodeValue 的值为 entire content
excluding the target。

**8.注释节点**

**Node.COMMENT_NODE (8)**

注释节点 comment 表示网页中的 HTML 注释。注释节点的节点类型 nodeType 的值为 8，节点名称 nodeName 的值为'#comment'
，nodeValue 的值为注释的内容。

**9.文档节点**

**Node.DOCUMENT_NODE (9)**

文档节点 document 表示 HTML 文档，也称为根节点，指向 document 对象。文档节点的节点类型 nodeType 的值为 9，节点名称 nodeName 的值为'#document'
，nodeValue 的值为 null。

**10.文档类型节点**

**Node.DOCUMENT_TYPE_NODE (10)**
文档类型节点 DocumentType 包含着与文档的 doctype 有关的所有信息。文档类型节点的节点类型 nodeType 的值为 10，节点名称 nodeName 的值为 doctype 的名称，nodeValue 的值为 null。

**11.文档片段节点**

**Node.DOCUMENT_FRAGMENT_NODE (11)**

文档片段节点 DocumentFragment 在文档中没有对应的标记，是一种轻量级的文档，可以包含和控制节点，但不会像完整的文档那样占用额外的资源。该节点的节点类型 nodeType 的值为 11，节点名称 nodeName 的值为'#document-fragment'
，nodeValue 的值为 null。

**12.DTD 声明节点**

**Node.NOTATION_NODE (12)**

DTD 声明节点 notation 代表 DTD 中声明的符号。该节点的节点类型 nodeType 的值为 12，节点名称 nodeName 的值为符号名称，nodeValue 的值为 null

### 2.获取节点

> 返回值类型为 `nodelist`，是个类数组。
>
> 1. 使用`forEach` 和 迭代器 进行遍历
> 2. Array.from(els) 转为数组，方便使用数组的方法进行操作。

1. **[`getElementById`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById)**

2. **[`getElementsByClassName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByClassName)**

3. **[`getElementsByTagName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByTagName)**

4. **[`getElementsByName()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByName)**

5. **[`querySelector()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector)**

6. **[`querySelectorAll)()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll)**

**在 HTML 当中，一切都是节点**

1. **父节点 parentNode**
2. **兄弟节点 Sibling**
   1. **nextSibling 上一个兄弟节点**
   2. **previousSibling 下一个兄弟节点**
3. **子节点**
   1. **firstChild** 第一个
   2. **lastChild** 最后一个
   3. **childNodes**/**children**
      1. childNodes 所有类型的子节点
      2. children 所有元素子节点 nodeType 等于 1 的子节点

### 3.节点操作

#### 1. **创建节点**

```js
document.createElement('p'); // <p></p> nodeType 1
// 创建指定命名空间的元素节点 NameSpace 命名空间的名称 素节点名称
createElementNS('http://www.w3.org/2000/svg', 'svg'); // <svg></svg>  nodeType 1
document.createTextNode('文本节点 nodeType 3');
document.createComment('我是注释 nodeType 8'); // <!--我是注释 nodeType 8-->

let p = document.createElement('p');
p.append('hello world');
p.id = 'mydiv';
p.className = 'boxw';
```

#### 2. **虚拟节点**

> 虚拟节点：通过`document.createDocumentFragment()`创建的节点，它是一个存在于内存中的 DOM 节点，并没有添加到文档树中，所以不会影响页面的布局，因此可以用来临时存放节点，在需要的时候一次性添加到文档中，从而提高性能。

```js
document.createDocumentFragment();
```

#### 3. **插入节点**

```js
let parent = document.createElement('div');
let child1 = document.createElement('p');
let child2 = document.createElement('span');
let child3 = document.createTextNode('文本节点');

// 1. appendChild() - 在父节点的子节点列表末尾添加一个子节点
parent.appendChild(child1);
parent.appendChild(child2);
parent.appendChild(child3);

// 2. insertBefore() - 在参考节点之前插入一个节点
let newChild = document.createElement('strong');
parent.insertBefore(newChild, child2);

// 3. insertAdjacentElement() - 在指定位置插入元素
// beforebegin: 元素自身的前面
// afterbegin: 插入元素内部的第一个子节点之前
// beforeend: 插入元素内部的最后一个子节点之后
// afterend: 元素自身的后面
let target = document.createElement('div');
let adjacent = document.createElement('p');
target.insertAdjacentElement('beforebegin', adjacent);
target.insertAdjacentElement('afterbegin', adjacent);
target.insertAdjacentElement('beforeend', adjacent);
target.insertAdjacentElement('afterend', adjacent);

// 4. insertAdjacentHTML() - 在指定位置插入 HTML 字符串
target.insertAdjacentHTML('beforebegin', '<p>beforebegin</p>');
target.insertAdjacentHTML('afterbegin', '<p>afterbegin</p>');
target.insertAdjacentHTML('beforeend', '<p>beforeend</p>');
target.insertAdjacentHTML('afterend', '<p>afterend</p>');

// 5. insertAdjacentText() - 在指定位置插入文本
target.insertAdjacentText('beforebegin', '文本内容');

// 6. append() - 在父节点的子节点列表末尾添加一个或多个节点
parent.append(child1, child2, '文本节点');

// 7. prepend() - 在父节点的子节点列表开头添加一个或多个节点
parent.prepend(child1, child2, '文本节点');

// 8. after() - 在元素之后插入节点
child1.after(child2, '文本节点');

// 9. before() - 在元素之前插入节点
child1.before(child2, '文本节点');

// 10. replaceWith() - 用一组节点替换自身
child1.replaceWith(child2, '新节点');

// 11. replaceChild() - 用新节点替换旧节点
parent.replaceChild(newChild, child1);
```

#### 4. **删除节点**

```js
let parent = document.createElement('div');
let child1 = document.createElement('p');
let child2 = document.createElement('span');
let child3 = document.createElement('div');

parent.appendChild(child1);
parent.appendChild(child2);
parent.appendChild(child3);

// 1. removeChild() - 从父节点中删除指定的子节点
let removed = parent.removeChild(child1);
console.log(removed); // 返回被删除的节点

// 2. remove() - 从 DOM 中删除自身
child2.remove();

// 3. 删除所有子节点
while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
}

// 4. 使用 innerHTML 清空子节点（不推荐，有安全风险）
parent.innerHTML = '';

// 5. 使用 textContent 清空子节点（推荐）
parent.textContent = '';

// 6. 删除特定类型的子节点
function removeElementsByTagName(parent, tagName) {
  let elements = parent.getElementsByTagName(tagName);
  for (let i = elements.length - 1; i >= 0; i--) {
    elements[i].remove();
  }
}
removeElementsByTagName(parent, 'div');

// 7. 删除带有特定类名的子节点
function removeElementsByClassName(parent, className) {
  let elements = parent.getElementsByClassName(className);
  for (let i = elements.length - 1; i >= 0; i--) {
    elements[i].remove();
  }
}

// 8. 使用 querySelectorAll 删除匹配的节点
parent.querySelectorAll('.to-remove').forEach(el => el.remove());

// 9. 删除节点的所有属性
function removeAllAttributes(element) {
  while (element.attributes.length > 0) {
    element.removeAttribute(element.attributes[0].name);
  }
}

// 10. 替换节点（删除并添加）
let newNode = document.createElement('article');
parent.replaceChild(newNode, child3);
```

#### 5. **克隆节点**

```js
let original = document.createElement('div');
original.className = 'box';
original.textContent = '原始节点';

// 1. cloneNode() - 克隆节点
// 参数为 true 时，克隆节点及其所有后代节点
// 参数为 false 时，只克隆节点本身
let shallowClone = original.cloneNode(false);
let deepClone = original.cloneNode(true);

console.log(shallowClone.textContent); // 空字符串
console.log(deepClone.textContent); // '原始节点'

// 2. 克隆并添加到文档
document.body.appendChild(deepClone);

// 3. 克隆多个节点
let list = document.createElement('ul');
for (let i = 0; i < 5; i++) {
  let item = document.createElement('li');
  item.textContent = `项目 ${i + 1}`;
  list.appendChild(item);
}

let clonedList = list.cloneNode(true);
document.body.appendChild(clonedList);
```

#### 6. **节点属性操作**

```js
let element = document.createElement('div');

// 1. 设置属性
element.setAttribute('id', 'myId');
element.setAttribute('class', 'myClass');
element.setAttribute('data-value', '123');

// 2. 获取属性
let id = element.getAttribute('id');
let className = element.getAttribute('class');
let dataValue = element.getAttribute('data-value');

// 3. 删除属性
element.removeAttribute('class');

// 4. 检查属性是否存在
let hasId = element.hasAttribute('id');
let hasClass = element.hasAttribute('class');

// 5. 直接属性访问（常用）
element.id = 'newId';
element.className = 'newClass';
element.style.color = 'red';
element.style.fontSize = '16px';

// 6. data-* 属性操作
element.dataset.userId = '123';
element.dataset.userName = '张三';
console.log(element.dataset.userId);
console.log(element.dataset.userName);

// 7. classList 操作
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('highlight');
element.classList.contains('active');

// 8. 多个类名操作
element.classList.add('class1', 'class2', 'class3');
element.classList.remove('class1', 'class2');

// 9. 替换类名
element.classList.replace('oldClass', 'newClass');
```

##### style 操作

###### **setProperty**

> 设置 CSS 样式属性

```css
:root {
  --primary-color: red;
  --font-size: 16px;
}
```

```js
// 1. setProperty() - 设置 CSS 样式属性
element.style.setProperty('color', 'red');
element.style.setProperty('font-size', '16px');
element.style.setProperty('--primary-color', 'blue');
element.style.setProperty('--font-size', '20px');
```

###### **getPropertyValue**

> 获取 CSS 样式属性值

```js
// 1. getPropertyValue() - 获取 CSS 样式属性值
let color = element.style.getPropertyValue('color');
let fontSize = element.style.getPropertyValue('font-size');
```

###### **removeProperty**

> 移除 CSS 样式属性

```js
// 1. removeProperty() - 移除 CSS 样式属性
element.style.removeProperty('font-size');
```

###### **getPropertyValue**

> 返回的是属性的优先级字符串 `important!` 或空字符串 `''`。

```js
let hasColor = element.style.getPropertyPriority('color');
let hasFontSize = element.style.getPropertyPriority('font-size');
```

## 2. getComputedStyle

> 获取元素的计算样式，包含继承的样式。

```js
// 1. getComputedStyle() - 获取元素的计算样式
let computedStyle = getComputedStyle(element);

console.log(computedStyle.color); // 'red'
console.log(computedStyle.fontSize); // '16px'
console.log(computedStyle.getPropertyValue('--primary-color')); // 'blue'
console.log(computedStyle.getPropertyValue('--font-size')); // '20px'
// 2. getComputedStyle() - 获取伪元素的计算样式
let beforeContent = getComputedStyle(ele, '::before').attributeStyleMap.get(
  'content'
).value;
console.log(beforeContent); // 'before content'
```

## 3. getBoundingClientRect

> 获取元素的位置和大小，包含边框（border）和滚动条（scrollbar）。
> 相对于窗口的坐标
> 相对于文档的坐标 `getBoundingClientRect()` 加上当前页面滚动。

```js
// 1. getBoundingClientRect() - 获取元素的位置和大小
let rect = element.getBoundingClientRect();

console.log(rect.left); // 元素左边界距离视口左边界的距离
console.log(rect.top); // 元素上边界距离视口上边界的距离
console.log(rect.width); // 元素宽度
console.log(rect.height); // 元素高度
console.log(rect.x); // 元素左边界距离视口左边界的距离
console.log(rect.y); // 元素上边界距离视口上边界的距离
```

- left = x
- top = y
- right = x + width
- bottom = y + height

### 1. client

> 元素的可见部分大小，不包含滚动条。
>
> 1. `clientWidth`：元素的宽度，包含内边距（padding），不包含边框（border）和滚动条（scrollbar）。
> 2. `clientHeight`：元素的高度，包含内边距（padding），不包含边框（border）和滚动条（scrollbar）。

### 2. offset

> 元素的位置和大小，包含边框（border）和滚动条（scrollbar）。
>
> 1. `offsetWidth`：元素的宽度，包含内边距（padding）、边框（border）和滚动条（scrollbar）。
> 2. `offsetHeight`：元素的高度，包含内边距（padding）、边框（border）和滚动条（scrollbar）。
> 3. `offsetLeft`：元素的左偏移量，相对于最近的定位祖先元素（position 为 relative、absolute 或 fixed）。
> 4. `offsetTop`：元素的上偏移量，相对于最近的定位祖先元素（position 为 relative、absolute 或 fixed）。

### 3. scroll

> 元素的滚动大小，包含滚动条（scrollbar）。
>
> 1. `scrollWidth`：元素的宽度，包含内容区域（content）、内边距（padding）、边框（border）和滚动条（scrollbar）。
> 2. `scrollHeight`：元素的高度，包含内容区域（content）、内边距（padding）、边框（border）和滚动条（scrollbar）。
> 3. `scrollLeft`：元素的水平滚动位置，即元素内容区域左侧隐藏部分的宽度。
> 4. `scrollTop`：元素的垂直滚动位置，即元素内容区域顶部隐藏部分的高度。

## 4. 事件

### 1. addEventListener

[监听的事件类型](https://developer.mozilla.org/zh-CN/docs/Web/Events)

[**`Event`** 接口表示在 DOM 中出现的事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

```js
div.addEventListener('事件名称'，(e)=>{},Boolean)
//Boolean: true 捕获阶段调用函数  false 冒泡阶段调用函数
function a (Event){ console.log(123)}
button.addEventListener('click'，a,false)
button.removeEventListener('click',a,false)
```

### 2. 事件冒泡

> 事件冒泡是指当一个元素上的事件被触发时，该事件会从该元素开始，逐级向上冒泡到文档根元素。
> 事件冒泡的过程中，每个元素上绑定的事件处理函数都会被调用。
> 事件冒泡可以用于事件委托，即通过将事件处理函数绑定在父元素上，来处理子元素上的事件。
> `e.target` 指向触发事件的元素，而 `e.currentTarget` 指向绑定事件处理函数的元素。
> 事件冒泡可以通过 `e.stopPropagation()` 方法来阻止。
> 事件冒泡可以通过 `e.preventDefault()` 方法来阻止默认行为。

```js
// 事件冒泡示例
document.body.addEventListener('click', function (e) {
  console.log('body 被点击了');
});

document.getElementById('myDiv').addEventListener('click', function (e) {
  console.log('div 被点击了');
});

document.getElementById('myButton').addEventListener('click', function (e) {
  console.log('button 被点击了');
});
```

### 3. 鼠标事件

| 事件名      | 中文释义 | 触发时机                                         | 核心特点                   |
| ----------- | -------- | ------------------------------------------------ | -------------------------- |
| click       | 单击     | 鼠标按下并松开在同一元素上触发                   | mousedown + mouseup 组合   |
| dblclick    | 双击     | 短时间内连续两次单击同一元素                     | 依赖两次 click 触发        |
| contextmenu | 右键菜单 | 鼠标右键按下时触发（可阻止默认菜单）             | 右键专属                   |
| mousedown   | 鼠标按下 | 鼠标任意按键按下瞬间触发                         | 只按不松就触发             |
| mouseup     | 鼠标松开 | 鼠标按下的按键松开瞬间触发                       | 松键时触发                 |
| mousemove   | 鼠标移动 | 鼠标指针在元素范围内每移动一个像素就触发一次     | 高频触发（移动即触发）     |
| mouseover   | 鼠标移入 | 鼠标指针进入被选元素 或其子元素 时触发           | 会冒泡（子元素触发父元素） |
| mouseenter  | 鼠标进入 | 鼠标指针仅进入被选元素本身时触发（子元素无影响） | 不冒泡（性能更好）         |
| mouseout    | 鼠标移出 | 鼠标指针离开被选元素 或其子元素 时触发           | 会冒泡                     |
| mouseleave  | 鼠标离开 | 鼠标指针仅离开被选元素本身时触发（子元素无影响） | 不冒泡                     |

| 属性    | 说明                                                                                |
| ------- | ----------------------------------------------------------------------------------- |
| clientX | 以浏览器窗口左上顶角为原点，定位 x 轴坐标                                           |
| clientY | 以浏览器窗口左上顶角为原点，定位 y 轴坐标                                           |
| offsetX | 以当前事件的目标对象左上顶角为原点，定位 x 轴坐标                                   |
| offsetY | 以当前事件的目标对象左上顶角为原点，定位 y 轴坐标                                   |
| pageX   | 以 document 对象（即文档窗口）左上顶角为原点，定位 x 轴坐标                         |
| pageY   | 以 document 对象（即文档窗口）左上顶角为原点，定位 y 轴坐标                         |
| screenX | 计算机屏幕左上顶角为原点，定位 x 轴坐标                                             |
| screenY | 计算机屏幕左上顶角为原点，定位 y 轴坐标                                             |
| layerX  | 最近的绝对定位的父元素（如果没有，则为 document 对象）左上顶角为元素，定位 x 轴坐标 |
| layerY  | 最近的绝对定位的父元素（如果没有，则为 document 对象）左上顶角为元素，定位 y 轴坐标 |

### 4. touch 事件

> 触摸事件是指在移动设备上触发的事件，例如触摸屏幕、滑动、缩放等。
> 触摸事件可以通过 `touchstart`、`touchmove`、`touchend` 等事件类型来监听。
> 触摸事件对象（`TouchEvent`）包含了触摸相关的信息，例如触摸点的坐标、触摸时间等。

### 5. 键盘事件

| 事件名   | 中文释义 | 触发时机                                       | 核心特点       |
| -------- | -------- | ---------------------------------------------- | -------------- |
| keydown  | 按键按下 | 任意按键按下瞬间触发                           | 只按不松就触发 |
| keypress | 按键按下 | 字母、数字、符号键按下瞬间触发（不包括功能键） | 只按不松就触发 |
| keyup    | 按键松开 | 任意按键松开瞬间触发                           | 松键时触发     |

| 属性名     | 含义                                            | 示例（按下回车键） | 核心特点                                      |
| ---------- | ----------------------------------------------- | ------------------ | --------------------------------------------- |
| event.key  | 按键的实际含义 / 字符（与键盘布局、大小写有关） | Enter/'a'/'A'      | 最直观，优先使用（比如判断 "按的是回车"）     |
| event.code | 按键的物理位置（与键盘布局无关，固定）          | Enter/KeyA         | 适合判断 "按的是哪个物理键"（比如 WASD 方向） |

关键区别举例：

- 按下小写 a：key = 'a'，code = 'KeyA'，keyCode = 65
- 按下大写 A（Shift+A）：key = 'A'，code = 'KeyA'，keyCode = 65
- 按下数字键 5（主键盘）：key = '5'，code = 'Digit5'
- 按下数字键 5（小键盘）：key = '5'，code = 'Numpad5'

| 按键                | event.key  | event.code    | event.keyCode（参考） |
| ------------------- | ---------- | ------------- | --------------------- |
| 回车键              | Enter      | Enter         | 13                    |
| ESC 键              | Escape     | Escape        | 27                    |
| 空格键              | " "        | Space         | 32                    |
| Backspace（退格键） | Backspace  | Backspace     | 8                     |
| Tab（制表键）       | Tab        | Tab           | 9                     |
| 左方向键            | ArrowLeft  | ArrowLeft     | 37                    |
| 上方向键            | ArrowUp    | ArrowUp       | 38                    |
| 右方向键            | ArrowRight | ArrowRight    | 39                    |
| 下方向键            | ArrowDown  | ArrowDown     | 40                    |
| 数字 0-9（主键盘）  | 0-9        | Digit0-Digit9 | 48-57                 |
| A-Z 键              | a/A-z/Z    | KeyA-KeyZ     | 65-90                 |

### compositionstart/compositionupdate/compositionend

> 当用户开始输入复合字符（例如中文、日文等）时触发。
> 复合字符是指由多个字符组成的字符，例如中文字符、日文假名等。
> 当用户开始输入复合字符时，浏览器会先触发 `compositionstart` 事件，然后触发 `compositionupdate` 事件，最后触发 `compositionend` 事件。

### transitionend

> 当 CSS 过渡（transition）或动画（animation）结束时触发。
> 过渡是指元素从一种状态平滑过渡到另一种状态的过程，例如改变元素的位置、大小、颜色等。
> 动画是指元素通过一系列状态变化而产生的效果，例如旋转、闪烁等。
> 当过渡或动画结束时，浏览器会触发 `transitionend` 事件。

### animationend

> 当 CSS 动画（animation）结束时触发。
> 动画是指元素通过一系列状态变化而产生的效果，例如旋转、闪烁等。
> 当动画结束时，浏览器会触发 `animationend` 事件。

### visibilitychange

> 当元素的可见性发生变化时触发。
> 可见性变化包括元素被显示或隐藏，例如用户切换到其他标签页、最小化浏览器窗口等。
> 当元素的可见性发生变化时，浏览器会触发 `visibilitychange` 事件。

## 5. 表单操作

### 1. value / valueAs\*

#### 1. 普通 input（text/password/textarea）

- `value` → **字符串**
- `valueAsDate` → `null`
- `valueAsNumber` → `NaN`

#### 2. type="number"

- `value` → 字符串
- `valueAsNumber` → **数字**（推荐）
- `valueAsDate` → null

#### 3. 日期时间 input（date/time/datetime-local）

- `value` → **字符串**（`yyyy-mm-dd`）
- `valueAsDate` → **Date 对象**
- `valueAsNumber` → **毫秒时间戳**

---

### 2.常用工具方法

#### 1. 清空表单

```js
form.reset();
```

#### 2. 判断输入框是否为空

```js
function isEmpty(val) {
  return val === undefined || val === null || val.trim() === '';
}
```

#### 3. 获取数字（自动转数字）

```js
function getNum(el) {
  return el.valueAsNumber || Number(el.value) || 0;
}
```
