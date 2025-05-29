# Text


1. color

2. text-indent
   首行缩进

```css
p {
    text-indent: 2em;
}

```

3. line-height | text-align

```css
/* 文字水平居中垂直居中*/
div {
    line-height: 100px /*盒子高度*/;
    text-align: center;
}
```

4. vertical-align

   | 值          | 描述                        |
      | :---------- |:--------------------------|
   | baseline    | 默认。元素放置在父元素的基线上。          |
   | sub         | 垂直对齐文本的下标。                |
   | super       | 垂直对齐文本的上标                 |
   | top         | 把元素的顶端与行中最高元素的顶端对齐        |
   | text-top    | 把元素的顶端与父元素字体的顶端对齐         |
   | middle      | 把此元素放置在父元素的中部。            |
   | bottom      | 把元素的顶端与行中最低的元素的顶端对齐。      |
   | text-bottom | 把元素的底端与父元素字体的底端对齐。        |

5. text-transform

   | 值         | 描述                                           |
      | ---------- | ---------------------------------------------- |
   | none       | 默认。定义带有小写字母和大写字母的标准的文本。 |
   | capitalize | 文本中的每个单词以大写字母开头。               |
   | uppercase  | 定义仅有大写字母。                             |
   | lowercase  | 定义无大写字母，仅有小写字母。                 |

6. text-decoration

   | 值           | 描述                     |
   | :----------- | :----------------------- |
   | none         | 默认。定义标准的文本。   |
   | underline    | 定义文本下的一条线。     |
   | overline     | 定义文本上的一条线。     |
   | line-through | 定义穿过文本下的一条线。 |

7. <p>text-shadow</p>

```css
p {
    text-shadow: 2px 3px red/*h-shadow v-shadow blur color*/;
}
```

| 值          | 描述               |
|:-----------|:-----------------|
| *h-shadow* | 必需。水平阴影的位置。允许负值。 |
| *v-shadow* | 必需。垂直阴影的位置。允许负值。 |
| *blur*     | 可选。模糊的距离。        |
| *color*    | 可选。阴影的颜色。        |

8. white-space


9. text-overflow

```css
p {

    text-overflow: clip /*clip|ellipsis|string*/;
    /* clip:修剪文本*/
    /*ellipsis :省略符号来代表被修剪的文本。*/
}
```

10. letter-spacing / word-spacing

    value: normal / length（10px）
    1. letter-spacing 字间距，添加每个字母或汉字之间的空白
    2. word-spacing 词间距，添加每个单词之间的空白

11. writing-mode

    - `horizontal-tb`（默认）

      内容从左到右水平，从上到下垂直。下一条水平线位于上一条线的下方。

    - `vertical-rl`

      内容从上到下垂直流动，从右到左水平流动。下一条垂直线位于上一行的左侧。

    - `vertical-lr`

      内容从上到下垂直流动，从左到右水平流动。下一条垂直线位于前一行的右侧。

    - `sideways-rl`(实验)

      内容从上到下垂直流动，所有字形（即使是垂直脚本中的字形）也都向右侧设置。

    - `sideways-lr`(实验)

      内容从上到下垂直流动，所有字形（即使是垂直脚本中的字形）也朝左侧设置。

