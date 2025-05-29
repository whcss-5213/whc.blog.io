# 单位

#### 1.px

绝对单位,像素点.

#### 2.em

相对单位,根据父元素font-size计算自己的大小

```html

<body>
<div>
    第一层 // font-size = 10 * 2 px
    <div>
        第二层 // font-size = 10 * 2 * 2
        <div>
            第三层 // font-size = 10 * 2 * 2 * 2
        </div>
    </div>
</div>
</body>
```

```css
body {
    font-size: 10px;
}

div {
    font-size: 2em;
}
```

#### 3.rem

​ 相对单位,根据html的font-size计算自己的大小

```html
<body>
    <div>
        第一层    // font-size = 10 * 2 px
     </div>
      <p>
          第二层  // font-size = 10 * 3
      <p>
</body>
```

```css
html {
    font-size: 10px;
}

div {
    font-size: 2em;
}

p {
    font-size: 3em;
}
```

#### 4.vw和vh

​ vw : 当前看到画面的宽度

​ vh : 当前看到画面的高度

​ vw vh 取值范围: 1 - 100 ,即当前可视范围平均分成100份.

​ 50vw 当前可视宽度的一半

​ 50vh 当前可视高度的一半

#### 5.vmin和vmax

vmin : 点前屏幕较短的一边

vmax : 点前屏幕较长的一边

用法和vw vh 一样