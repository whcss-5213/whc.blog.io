# CSS 常用函数速

## 一、变量相关
### 1. var()
使用 CSS 变量，必须在 `:root` 或元素内定义。
```css
:root {
  --color: red;
}
.box {
  color: var(--color);
  /* 带默认值 */
  color: var(--not-exist, blue);
}
```

### 2. attr()
读取 HTML 标签属性值，多用于 `content`。
```css
.box::after {
  content: attr(data-info);
}
```
```html
<div data-info="提示文字"></div>
```

---

## 二、计算相关
### 3. calc()
加减乘除四则混合计算，**`+ -` 两边必须加空格**。
```css
width: calc(100% - 20px);
height: calc(50vh + 20px);
```

### 4. clamp()
 clamp(最小值, 首选值, 最大值)
```css
font-size: clamp(14px, 4vw, 24px);
```
效果：最小14px、最大24px、中间随屏幕自适应。

### 5. min() / max()
```css
width: min(100%, 600px);
height: max(300px, 50vh);
```

---

## 三、颜色相关
### 6. rgb() / rgba()
```css
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);
```

### 7. hsl() / hsla()
色相、饱和度、亮度
```css
color: hsl(0, 100%, 50%);
color: hsla(0, 100%, 50%, 0.5);
```

---

## 四、变换 transform 函数
### 8. 位移
```css
transform: translateX(10px);
transform: translateY(10px);
transform: translate(10px, 10px);
```

### 9. 旋转
```css
transform: rotate(45deg);
transform: rotateZ(45deg);
```

### 10. 缩放
```css
transform: scale(0.8);
transform: scaleX(2);
```

### 11. 斜切
```css
transform: skew(10deg);
```

### 12. 矩阵
```css
transform: matrix(…);
```

---

## 五、渐变函数
### 13. linear-gradient()
```css
background: linear-gradient(red, blue);
```

### 14. radial-gradient()
```css
background: radial-gradient(circle, red, blue);
```

### 15. conic-gradient()
锥形渐变（饼图）
```css
background: conic-gradient(red, yellow, green);
```

---

## 六、过滤效果 filter
### 16. filter 系列
```css
filter: blur(5px);         /* 模糊 */
filter: brightness(1.2);   /* 亮度 */
filter: contrast(1.5);     /* 对比度 */
filter: grayscale(1);      /* 灰度 */
filter: saturate(2);       /* 饱和度 */
filter: hue-rotate(90deg); /* 色相旋转 */
filter: opacity(0.5);      /* 透明度 */
```

---

## 七、伪类与函数选择器
### 17. :is()
```css
:is(.box, .card) .title { color: red; }
```

### 18. :where()
同 `:is`，但**优先级为 0**。

### 19. :nth-child(an+b)
```css
li:nth-child(2n+1) { color: red; }
```

### 20. url()
```css
background: url(./bg.png);
```

---

## 八、动画 / 过渡相关
### 21. cubic-bezier()
贝塞尔曲线
```css
transition: all .3s cubic-bezier(0.25, 0.1, 0.5, 1);
```

### 22. steps()
逐帧动画
```css
animation: move 1s steps(10) infinite;
```

---

## 极简记忆口诀
- 变量用 `var`
- 取属性用 `attr`
- 计算用 `calc`
- 限制大小用 `clamp`
- 颜色用 `rgb`/`hsl`
- 渐变 `linear/radial/conic`
- 模糊用 `blur`
- 缓动用 `cubic-bezier`
