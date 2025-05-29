# animate

###  transform

#### 1 translate

百分比 是自身宽度的百分比

```css
div {
   transform: translate(10px,10px);
   transform: translateX(100px) translateY(100px) translateZ(100px);
}
```

#### 2. scale

```css
div {
   transform: scale(1.5);
   transform: scaleX(2) scaleY(2) scaleZ(2);
}
```

#### 3. rotate

````css
div {
   transform:rotate(10deg);
   transform:rotateX(10deg);
   transform:rotateY(10deg);
   transform:rotateZ(10deg);
   transform:rotate3d(0,0.2,1,10deg);
}
````

#### 4.skew

倾斜转换。

```css
div {
   transform:skew(1deg,2deg);
   transform:skewX(2deg) skewY(3deg) ;
}
```

#### 5.transform-origin

参考点

```css
div {
   transform-origin:50% 50% 0;/*默认值*/
   transform-origin:100px 200px;
   transform-origin:top center;
}
```

#### 6.3d

```css
div {
   transform-style:preserve-3d;
   transform:perspective(500px);
   backface-visibility:visible /*visible(背面可见)|hidden(背面不可见)*/;
   perspective-origin:top center;
}
```

## transition

```css
div{
    /** 时长一秒 延时0.5s **/
    transition: 1s .5s;
    /** 时长一秒 延时负0.5s **/
    transition: 1s -.5s;
    /** 时长一秒 延时负0.5s **/
    transition: -.5s 1s;
}
```

| 属性                       | 描述                                                         |
| :------------------------- | :----------------------------------------------------------- |
| transition                 | 简写属性，用于在一个属性中设置四个过渡属性。                 |
| transition-property        | 规定应用过渡的 CSS 属性的名称。 初始值all ，所有属性，可不写。 |
| transition-duration        | 定义过渡效果花费的时间。默认是 0。                           |
| transition-timing-function | 规定过渡效果的时间曲线。默认是 "ease"。                      |
| transition-delay           | 规定过渡效果何时开始。默认是 0。为负值，会省略部分动画       |

### transitionend
```js
document
  .querySelector('div')
  .addEventListener('transitionend', e => console.log('过渡结束'));
```

## animation

1. animation-timing-function

| 值                                  | 描述                                                         |
|:-----------------------------------|:----------------------------------------------------------- |
| linear                             | 动画从头到尾的速度是相同的。                                 |
| ease                               | 默认。动画以低速开始，然后加快，在结束前变慢。               |
| ease-in                            | 动画以低速开始。                                             |
| ease-out                           | 动画以低速结束。                                             |
| ease-in-out                        | 动画以低速开始和结束。                                       |
| cubic-bezier(*n*,*n*,*n*,*n*)      | 在 cubic-bezier 函数中自己的值。可能的值是从 0 到 1 的数值。 |
| steps(\<integer>,[ start \| end ]?) | 分步执行动画                                                 |

2. steps

   steps(\<integer>,[ start | end ]?)

   参数一：第一个参数是整数。主要用来指定函数间隔的数量，且必须是正整数(大于0)。
   参数二： 可选 ，接受 **start** 和 **end**，指定在每个间隔的起点或是终点发生阶跃变化，默认为 **end**。

   **Keyword values** : start-step、end-step

   step-start等同于steps(1,start)，动画分成1步，动画执行时为开始左侧端点的部分为开始；
   step-end等同于steps(1,end)：动画分成1步，动画执行时以结尾端点为开始，默认值为end

3. animation-direction



| 值                | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| normal            | 默认值。动画按正常播放。                                     |
| reverse           | 动画反向播放。                                               |
| alternate         | 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。 |
| alternate-reverse | 动画在奇数次（1、3、5...）反向播放，在偶数次（2、4、6...）正向播放。 |

3. animation-play-state

| 值      | 描述               |
| :------ | :----------------- |
| paused  | 指定暂停动画       |
| running | 指定正在运行的动画 |

4. animation-fill-mode


| 值        | 描述                                                         |
| :-------- | :----------------------------------------------------------- |
| none      | 默认值。动画在动画执行之前和之后不会应用任何样式到目标元素。 |
| forwards  | 在动画结束后，动画将应用该属性值。最后一帧。                 |
| backwards | 动画将应用在 animation-delay 定义期间启动动画的第一次迭代的关键帧中定义的属性值。这些都是 from 关键帧中的值或 to 关键帧中的值。 |
| both      | 动画遵循 forwards 和 backwards 的规则。也就是说，动画会在两个方向上扩展动画属性。 |


### animationed

```js
addEventListener('animationed', e => console.log('动画结束'));		
```