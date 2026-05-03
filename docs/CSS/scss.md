# scss

## 变量

同名变量后面的会覆盖前面的

```scss
$highlight-color: #F90;
.selected {
  border: 1px solid $highlight-color;
}

/*如果这个变量被声明赋值了，那就用它声明的值，否则就用这个默认值。*/
$fancybox-width: 400px !default;

$ss:"info"
$hh:"border";
.L-#{info}{
    #{$hh}-color:red;
}

```

## @use

## @import

## 函数

1. @if

   ```scss
   $tyy: true;
   $t: fales;
   body {
     @if tyy {
       font-size: 10px;
     } @else if not t {
       //not 取反
       font-size: 20px;
     }
   }
   ```

2. @for

   ```scss
   $max: 5;
   //循环4次
   @for $i from 1 to $max {
     h1 {
       font-size: 10px;
     }
   }

   //循环5次
   @for $i from 1 through $max {
     h1 {
       font-size: 12px;
     }
   }
   ```

3. @each

   ```scss
   $icons: a b c;
   @each $icon in $icons {
     div {
       background-image: url(./#{$icon}.png);
     }
   }
   ```

   ```css
   # 编译结果 div {
     background-image: url(./a.png);
   }

   div {
     background-image: url(./b.png);
   }

   div {
     background-image: url(./c.png);
   }
   ```

4. @while

   ```scss
   @while 条件 {
       .......
   }
   ```

5. 自定义函数

   ```scss
   @function add() {
   }
   ```

## 嵌套

```scss
#content {
  article {
    h1 {
      color: #333;
    }
    p {
      margin-bottom: 1.4em;
    }
  }
  aside {
    background-color: #eee;
  }
}
```

```css
/* 编译后 */
#content article h1 {
  color: #333;
}
#content article p {
  margin-bottom: 1.4em;
}
#content aside {
  background-color: #eee;
}
```

1. 父选择器的标识符 &

   ```scss
   .text a {
     color: blue;
     :hover {
       color: red;
     }
   }
   ```

   ```css
   /*会按照选择器嵌套原则将其编译成如下css代码:*/
   .text2 a {
     color: blue;
   }

   .text2 a :hover {
     color: red;
   }
   /*悬浮时不会生效*/
   ```

   ```scss
   .text a {
     color: blue;
     &:hover {
       color: red;
     }
   }
   ```

   ```css
   /* 编译的时会将&替换为父选择器a，编译后的css代码如下:*/
   .text a {
     color: blue;
   }
   .text a:hover {
     color: red;
   }
   ```

2. 群组嵌套

   ```css
   .container h1,
   .container h2,
   .container h3 {
     margin-bottom: 0.8em;
   }
   ```

   ```scss
   .container {
     h1,
     h2,
     h3 {
       margin-bottom: 0.8em;
     }
   }
   ```

   ```css
   nav a,
   aside a {
     color: blue;
   }
   ```

   ```scss
   nav,
   aside {
     a {
       color: blue;
     }
   }
   ```

3. 嵌套属性

   ```css
   nav {
     border: 1px solid #ccc;
     border-left: 0px;
     border-right: 0px;
   }
   ```

   ```scss
   nav {
     border: 1px solid #ccc {
       left: 0px;
       right: 0px;
     }
   }

   nav {
     border: {
       style: solid;
       width: 1px;
       color: #ccc;
     }
   }
   ```

## 注释

```scss
body {
  color: #333; // 这种注释内容不会出现在生成的css文件中
  padding: 0; /* 这种注释内容会出现在生成的css文件中 */
}

body {
  color /* 这块注释内容不会出现在生成的css中 */: #333;
  padding: 1; /* 这块注释内容也不会出现在生成的css中 */ 0;
}


```

## @mixin @include

1. 混合器

```scss
@mixin rounded-corners {
  border-radius: 5px;
}

notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}

@mixin absolute($top, $left) {
  position: absolute;
  top: $top;
  left: $left;
}

.dd {
  @include absolute(100px, 200px);
}
```

```css
.notice {
  background-color: green;
  border: 2px solid #00aa00;
  border-radius: 5px;
}
```

2. 混合器传值

   ```scss
   @mixin link-colors($normal, $hover, $visited) {
     color: $normal;
     &:hover {
       color: $hover;
     }
     &:visited {
       color: $visited;
     }
   }

   a {
     @include link-colors(blue, red, green);
   }

   /*这种形式的传参，参数顺序就不必再在乎了，只需要保证没有漏掉参数即可*/
   a {
     @include link-colors($normal: blue, $visited: green, $hover: red);
   }
   ```

   ```css
   /*编译结果*/
   a {
     color: blue;
   }
   a:hover {
     color: red;
   }
   a:visited {
     color: green;
   }
   ```

3. 参数默认值

   ```scss
   @mixin link-colors($normal, $hover: red, $visited: $normal) {
     color: $normal;
     &:hover {
       color: $hover;
     }
     &:visited {
       color: $visited;
     }
   }
   ```

## @extend

```scss
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

## map

| 函数                         | 描述 & 实例                                                              |
| :--------------------------- | :----------------------------------------------------------------------- |
| map-get(_map_, _key_)        | 返回 Map 中 _key_ 所对应的 value(值)。如没有对应的 key，则返回 null 值。 |
| map-has-key(_map_, _key_)    | 判断 _map_ 是否有对应的 _key_，存在返回 true，否则返回 false。           |
| map-keys(_map_)              | 返回 _map_ 中所有的 key 组成的队列。                                     |
| map-merge(_map1_, _map2_)    | 合并两个 map 形成一个新的 map 类型，即将 _map2_ 添加到 *map1*的尾部      |
| map-remove(_map_, _keys..._) | 移除 _map_ 中的 keys，多个 key 使用逗号隔开。                            |
| map-values(_map_)            | 返回 _map_ 中所有的 value 并生成一个队列。                               |

```scss
$font: (
  s: 10px,
  m: 12px,
  l: 14px,
);
.m1 {
  font-size: map-get($font, s);
  font-size: map-get($map: $font, $key: l);
}
```

```css
.m1 {
  font-size: 10px;
  font-size: 14px;
}
```

## 数据类型

```scss
type-of(5px) //number

type-of("hello") //string
type-of(hello) //string

type-of(1px solid #fff) //list

type-of(#fff) //color
type-of(red) //color
type-of(rgb(15,125,55)) //color
```

1. numbr
   - percentage($value)：将一个不带单位的数转换成百分比值，如果转换的值是一个带有单位的值，那么在编译的时候会报错误信息：
   - round($value)：将数值四舍五入，转换成一个最接近的整数，可以携带单位的任何数值。
   - ceil($value)：将大于自己的小数转换成下一位整数；将一个数转换成最接近于自己的整数，会将一个大于自身的任何小数转换成大于本身1的整数。也就是只做入，不做舍的计算
   - floor($value)：将一个数去除他的小数部分；floor()函数刚好与ceil()函数功能相反，其主要将一个数去除其小数部分，并且不做任何的进位。也就是只做舍，不做入的计算
   - abs($value)：返回一个数的绝对值；
   - min($numbers…)：找出几个数值之间的最小值；
   - max($numbers…)：找出几个数值之间的最大值。

   ```scss
   font-size:(50/20)px;  //2.5px
   font-size:10px+30px;  //40px

   font-size:abs(-50px); //50px,返回绝对值
   font-size:round(5.6px); //6px 四舍五入
   font-size:ceil(5.1px); //6px 进一
   font-size:floor(5.6px); //5px 舍去小数
   font-s
   ```

2. string
   - unquote($string)：只能删除字符串最前和最后的引号（双引号或单引号），而无法删除字符串中间的引号。如果字符没有带引号，返回的将是字符串本身。
   - quote($string)：只能给字符串增加双引号，而且字符串中间有单引号或者空格时，需要用单引号或双引号括起，否则编译的时候将会报错。

3. list
   - length($list)：返回一个列表的长度值；
   - nth(\$list, $n)：返回一个列表中指定的某个标签值
   - join(\$list1, $list2, [$separator])：将两个列给连接在一起，变成一个列表；
   - append(\$list1, ​\$val, [$separator])：将某个值放在列表的最后；
   - zip($lists…)：将几个列表结合成一个多维的列表；
   - index(\$list, $value)：返回一个值在列表中的位置值。

   | 函数                                             | 描述 & 实例                                                                                                                                                                                                                                                                                                                                        |
   | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | append(_list_, _value_, [*separator*])           | 将单个值 _value_ 添加到列表尾部。_separator_ 是分隔符，默认会自动侦测，或者指定为逗号或空格。 **实例: **append((a b c), d) 结果: a b c d append((a b c), (d), comma) 结果: a, b, c, d                                                                                                                                                              |
   | index(_list_, _value_)                           | 返回元素 _value_ 在列表中的索引位置。 **实例:** index(a b c, b) 结果: 2 index(a b c, f) 结果: null                                                                                                                                                                                                                                                 |
   | is-bracketed(_list_)                             | 判断列表中是否有中括号 **实例:** is-bracketed([a b c]) 结果: true is-bracketed(a b c) 结果: false                                                                                                                                                                                                                                                  |
   | join(_list1_, _list2_, [*separator, bracketed*]) | 合并两列表，将列表 _list2_ 添加到列表 _list1_ 的末尾。_separator_ 是分隔符，默认会自动侦测，或者指定为逗号或空格。 _bracketed_ 默认会自动侦测是否有中括号，可以设置为 true 或 false。 **实例:** join(a b c, d e f) 结果: a b c d e f join((a b c), (d e f), comma) 结果: a, b, c, d, e, f join(a b c, d e f, $bracketed: true) 结果: [a b c d e f] |
   | length(_list_)                                   | 返回列表的长度 **实例:** length(a b c) 结果: 3                                                                                                                                                                                                                                                                                                     |
   | list-separator(_list_)                           | 返回一列表的分隔符类型。可以是空格或逗号。 **实例:** list-separator(a b c) 结果: "space" list-separator(a, b, c) 结果: "comma"                                                                                                                                                                                                                     |
   | nth(_list_, _n_)                                 | 获取第 _n_ 项的值。 **实例:** nth(a b c, 3) 结果: c                                                                                                                                                                                                                                                                                                |
   | set-nth(_list_, _n_, _value_)                    | 设置列表第 _n_ 项的值为 _value_。 **实例:** set-nth(a b c, 2, x) 结果: a x c                                                                                                                                                                                                                                                                       |
   | zip(_lists_)                                     | 将多个列表按照以相同索引值为一组，重新组成一个新的多维度列表。 **实例:** zip(1px 2px 3px, solid dashed dotted, red green blue) 结果: 1px solid red, 2px dashed green, 3px dotted blue                                                                                                                                                              |

4. color

   | 函数                                                                                     | 描述 & 实例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | mix(_color1_, _color2_, _weight_)                                                        | 把两种颜色混合起来。 _weight_ 参数必须是 0% 到 100%。默认 weight 为 50%，表明新颜色各取 50% color1 和 color2 的色值相加。如果 weight 为 25%，那表明新颜色为 25% color1 和 75% color2 的色值相加。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
   | adjust-hue(_color_, _degrees_)                                                           | 通过改变一个颜色的色相值（-360deg - 360deg），创建一个新的颜色。 **实例:** adjust-hue(#7fffd4, 80deg); 结果: #8080ff                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
   | adjust-color(_color_, _red_, _green_, _blue_, _hue_, _saturation_, _lightness_, _alpha_) | 这个函数能够调整给定色彩的一个或多个属性值，包括 RGB 和 HSL 色彩的各项色值参数，另外还有 alpha 通道的取值。这些属性值的调整依赖传入的关键值参数，通过这些参数再与给定颜色相应的色彩值做加减运算。 **实例:** adjust-color(#7fffd4, blue: 25); 结果:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | change-color(_color_, _red_, _green_, _blue_, _hue_, _saturation_, _lightness_, _alpha_) | 跟上面 adjust-color 类似，只是在该函数中传入的参数将直接替换原来的值，而不做任何的运算。 **实例:** change-color(#7fffd4, red: 255); 结果: #ffffd4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
   | scale-color(_color_, _red_, _green_, _blue_, _saturation_, _lightness_, _alpha_)         | 另一种实用的颜色调节函数。adjust-color 通过传入的参数简单的与本身的色值参数做加减，有时候可能会导致累加值溢出，当然，函数会把结果控制在有效的阈值内。而 scale-color 函数则避免了这种情况，可以不必担心溢出，让参数在阈值范围内进行有效的调节。 举个例子，一个颜色的亮度 lightness 取值在 0% ~ 100% 之间，假如执行 scale-color($color, $lightness: 40%)，表明该颜色的亮度将有 (100 - 原始值) × 40% 的增幅。  另一个例子，执行 scale-color($color, $lightness: -40%)，表明这个颜色的亮度将减少 (原始值 - 0) × 40% 这么多的值。 所有传参的取值范围都在 0% ~ 100% 之间，并且 RGB 同 HSL 的传参不能冲突。 `scale-color(hsl(120, 70%, 80%), $lightness: 50%) => hsl(120, 70%, 90%) scale-color(rgb(200, 150, 170), $green: -40%, $blue: 70%) => rgb(200, 90, 229) scale-color(hsl(200, 70%, 80%), $saturation: -90%, $alpha: -30%) => hsla(200, 7%, 80%, 0.7)` |
   | rgba(_color_, _alpha_)                                                                   | 根据红、绿、蓝和透明度值创建一个颜色。 **实例:** rgba(#7fffd4, 30%); 结果: rgba(127, 255, 212, 0.3)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | lighten(_color_, _amount_)                                                               | 通过改变颜色的亮度值（0% - 100%），让颜色变亮，创建一个新的颜色。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
   | darken(_color_, _amount_)                                                                | 通过改变颜色的亮度值（0% - 100%），让颜色变暗，创建一个新的颜色。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
   | saturate(_color_, _amount_)                                                              | 提高传入颜色的色彩饱和度。等同于 adjust-color( color, saturation: amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | desaturate(_color_, _amount_)                                                            | 调低一个颜色的饱和度后产生一个新的色值。同样，饱和度的取值区间在 0% ~ 100%。等同于 adjust-color(color, saturation: -amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | opacify(_color_, _amount_)                                                               | 降低颜色的透明度，取值在 0-1 之。等价于 adjust-color(color, alpha: amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
   | fade-in(_color_, _amount_)                                                               | 降低颜色的透明度，取值在 0-1 之。等价于 adjust-color(color, alpha: amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
   | transparentize(_color_, _amount_)                                                        | 提升颜色的透明度，取值在 0-1 之间。等价于 adjust-color(color, alpha: -amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
   | fade-out(_color_, _amount_)                                                              | 提升颜色的透明度，取值在 0-1 之间。等价于 adjust-color(color, alpha: -amount)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
