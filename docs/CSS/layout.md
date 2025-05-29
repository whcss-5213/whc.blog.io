# 布局

## flex

### 1.flex-direction

​ **主轴方向**

```css
div {
  flex-direction: row; //从左往右 (默认)
  flex-direction: row-reverse; //从右往左
  flex-direction: column; //从上往下
  flex-direction: column-reverse; //从下向上
}
```

### 2.flex-wrap

```css
div {
  flex-wrap: nowrap; //不换行(默认)
  flex-wrap: wrap; //换行,第一行在最上面.依次向下
  flex-wrap: wrap-reverse; //换行,第一行在最下面.依次向上
}
```

### 3.flex-flow

flex-flow : \<flex-direction> \<flex-wrap> ;

### 4.对齐方式

1. justify-content

​ 在主轴上对齐方式 可以让各个项目分开

- flex-start 开始
- center 中间
- flex-end 结束
- space-evenly 项目之间、项目和边框之间的间隔相同
- space-around 项目两边间隔相等，项目和边框之间有间隔
- space-between 项目两边间隔相等，项目和边框之间没有间隔

2. align-items

​ 在交叉轴上的对齐方式

- flex-start 开始
- center 中间
- flex-end 结束
- baseline 第一行文字的基准线
- stretch 如果项目为设定高度或设为 auto，将占满整个容器

3. align-content

​ 多条主轴的对齐方式,同 justify-content

### 项目属性

#### 1.order

​ order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。

#### 2.flex-grow

flex-grow 属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。

如果所有项目的`flex-grow`属性都为 1，则它们将等分剩余空间（如果有的话）。

如果一个项目的`flex-grow`属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

#### 3.flex-shrink

`flex-shrink`属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

如果所有项目的`flex-shrink`属性都为 1，当空间不足时，都将等比例缩小。

如果一个项目的`flex-shrink`属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

#### 4.flex-basis

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。

它的默认值为`auto`，即项目的本来大小。

#### 5.flex

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。
后两个属性可选该属性有两个快捷值：`auto` (`1 1 auto`) 和 none (`0 0 auto`)。

```css
.root {
  flex: auto;
}
```

#### 6.align-self

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

## grid

#### 1.容器属性

display:grid;

默认情况下，容器元素都是块级元素，但也可以设成行内元素。
display: inline-grid;

```css
grid-template-columns: repeat(auto-fill, minmax(42.8rem, 1fr));
```

1. **repeat()**

   **repeat( ‘重复的次数’ , ‘重复的值’ )**

2. **auto-fill**

   单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格,直到容器不能放置更多的列。

3. **fr**

   fr(fraction)表示比例关系

4. **minmax()**

   `minmax()`函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

5. **auto**

   `auto`关键字表示由浏览器自己决定长度。

6. **网格线的名称**

   可以使用方括号，指定每一根网格线的名字，方便以后的引用。

   ```css
   .container {
     display: grid;
     grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
     grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];
   }
   ```

###### 1. 列宽行高

`grid-template-columns`属性定义每一列的列宽
`grid-template-rows`属性定义每一行的行高。

```css
div {
  grid-template-columns: 1fr 100px 200px;
  grid-template-rows: 1fr 100px 200px;
}
```

```css
div {
  grid-template: grid-template-columns / grid-template-rows;
}
```

###### 2.行/列间距 gap

`grid-row-gap`属性设置行与行的间隔（行间距），`grid-column-gap`属性设置列与列的间隔（列间距）。

`gap`属性是`grid-column-gap`和`grid-row-gap`的合并简写形式，

```css
gap: <grid-row-gap> <grid-column-gap>;
```

如果`grid-gap`省略了第二个值，浏览器认为第二个值等于第一个值。

###### 3. 区域

网格布局允许指定"区域"（area）

```css
grid-template-areas:
  'header header header'
  'main main sidebar'
  'footer footer footer';
```

如果某些区域不需要利用，则使用"点"（`.`）表示。表示没有用到该单元格，或者该单元格不属于任何区域。

```css
grid-template-areas:
  'a . c'
  'd . f'
  'g . i';
```

注意: 区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为`区域名-start`，终止网格线自动命名为`区域名-end`。

###### 4. grid-auto-flow

grid-auto-flow : row(默认值)｜ column ｜ row dense ｜ column dense

row(默认值) : 先行后列
row : 先列后行
row dense : "先行后列"，并且尽可能紧密填满，尽量不出现空格。
column dense : "先列后行"，并且尽量填满空格。

###### 5. place-items

1. `justify-items  align-items`

   justify-items : 单元格内容的水平位置（左中右）
   align-items : 单元格内容的垂直位置（上中下）

   - start：对齐单元格的起始边缘。
   - end：对齐单元格的结束边缘。
   - center：单元格内部居中。
   - stretch：拉伸，占满单元格的整个宽度（默认值）。

2. `place-items`

   `place-items`属性是`align-items`属性和`justify-items`属性的合并简写形式。
   如果省略第二个值，则浏览器认为与第一个值相等。

   ```css
   place-items: <align-items> <justify-items>;
   ```

###### 6. place-content

`justify-content`整个内容区域在容器里面的水平位置（左中右）

`align-content`整个内容区域的垂直位置（上中下）

- start - 对齐容器的起始边框。
- end - 对齐容器的结束边框。
- center - 容器内部居中。
- stretch - 项目大小没有指定时，拉伸占据整个网格容器。
- space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
- space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。
- space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

###### 7. 越界问题

`grid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与`grid-template-columns`和`grid-template-rows`完全相同。
如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

#### 项目属性

###### 1. 网格线

指定项目的四个边框，分别定位在哪根网格线。

```css
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
}

.item-1 {
  grid-column-start: header-start;
  grid-column-end: header-end;
}

.item-1 {
  grid-column-start: span 2; // 跨越２个单元格
}
```

###### 2. 网格线简写

```css
.item-1 {
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}

.item-1 {
  grid-column: 1;
  grid-row: 1;
}
```

###### 3. grid-area

`grid-area`属性指定项目放在哪一个区域。

###### 4. 对齐方式

`justify-self`设置单元格内容的水平位置（左中右），跟`justify-items`用法完全一致，**只作用于单个项目。**
`align-self`设置单元格内容的垂直位置（上中下），跟`align-items`用法完全一致，**只作用于单个项目。**

### 元素屏幕居中显示

#### position
```css

.parent {
    position: relative;
}
.child {
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
}
/**
 经典写法
 动画的 transform 优先级高会覆盖前面的 transform
 定位出问题
**/
.toast {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
}
```
#### fit-content
```css
/**
 更好写法，可以做动画
**/
.toast {
    position: fixed;
    width: fit-content;
    inset-inline: 1rem;
    margin-inline: auto;
}
/**
 兼容写法
**/
.toast {
    position: fixed;
    width: fit-content;
    left: 1rem;
    right: 1rem;
    margin-left: auto;
    margin-right: auto;
}
```