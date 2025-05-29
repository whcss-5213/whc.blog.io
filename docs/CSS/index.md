# CSS

## 选择器

#### 1.标签选择器

```html
<p>123313</p>
```

```css
p {
	color:red;
}
```

#### 2.ID选择器

```html
<p id = "one">123313</p>
```

```css
#one {
    color:red;
}
```

#### 3.class选择器

```html
<p class = "two">123313</p>
```

```css
.two {
	color:red;
}
```

#### 4.空格选择器

​	选择所有的子元素

```html
<div class="abc">
    <div></div>
    <div></div>
</div>
```

```css
.abc div{
	width: 100px;
}
```

#### 5.  > 选择器

​	只选取第一层的子元素,子元素里的子元素不会被选取.

```html
<div class="abc">
    <div></div>
    <div></div>
    <div></div>
</div>
```

```css
.abc > div{
	width: 100px;
}
```

#### 6.  + 选择器

​		紧贴着的第一个兄弟元素,中间不能有任何的别的元素

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
.abc + div{
	width: 100px;
}
```

#### 7.  ~  选择器

​		所有的兄弟元素

```html
<div>
    <div class="abc">
    	<div></div>
	</div>
    <div></div>  
    <div></div>
</div>
```

```css
.abc ~ div{
	width: 100px;
}
```

#### 8.  *  选择器

所有html标签

```css
* {
	padding: 0;
}
```

#### 9.  属性选择器

```html
<a href="http://www.baidu.com" title ="百度" ></a>
<div class="abc-1"></div>
<div class="abc-2"></div>
```

```css
a[title]{  }  /*具有title属性的元素*/
```

```css
a[title = "百度"]{  }  /*title 等于百度的属性 */ 
```

```css
div[class ^= "abc"]   /*以abc开头的元素*/
```

```css
div[class $= "abc"]   /*以abc结尾的元素*/
```

```css
div[class *= "abc"]   /*以含有abc的元素*/
```

#### 10. 结构伪类选择器

-child , -of-type

```html
<div class="nth">
    <div></div>
    <header></header>
    <div></div>
    <div></div>
    <section></section>
    <div></div>
    <div></div>
    <section></section>
    <div></div>
</div>
```

```css
.nth header:first-child{}     /*选择不到,因为第一个子元素不是 header*/
.nth header:first-of-type{}	  /*能选到,选择到第一个header标签*/

.nth div:nth-child(2){}     /*选择不到,因为第二个子元素不是 div */
.nth div:nth-of-type(2){} 	/*能选到,选择到第二个div 标签*/
```

-child : 按照子元素的顺序进行筛选,

-of-type :　先按照子元素的类型分类，在按照同类型标签的顺序进行筛选

```css
/* 偶数 */
nth-child(even)
nth-of-type(even)
/* 奇数 */
nth-child(odd)
nth-of-type(odd)
/* 从第五个到最后 */
nth-child(n+5)
nth-of-type(n+5)
/* 前六个 */
nth-child(n-6)
nth-of-type(n-6)

p:only-of-type	/*选择所有仅有一个子元素为p的元素*/
p:only-child	/*选择所有仅有一个子元素为p的元素*/
```

#### 11.伪类选择器

:checked  	表单被选中

:focus		表单获取焦点

:focus-within 当元素或其任意后代元素被聚焦时

:link		未访问

:active		被激活

:visited	被访问后

:hover		鼠标悬浮

:target      突出显示活动的 HTML 

#### 12伪元素选择器

1. 必须有content属性，可以在content里放字体图标
2. 是行内元素，一般需要加 display:block
3. 通常需要定位
```css
::after{content:''}
::before{content:''}

```

#### 13.权重

|        选择器        |    权重    |
| :------------------: | :--------: |
|    **!important**    | １００００ |
|       内联样式       |  １０００  |
|      ＩＤ选择器      |   １００   |
| 类、伪类、属性选择器 |    １０    |
|  标签、伪元素选择器  |     １     |
|  *、>、+、~　选择器  |     ０     |

描述准确程度

```html	
<div id="d1">
    <p>1</p>
</div>
```

```css
#di{
	color:red;
}
p {
  color:blue; /* blue 生效，因为描述更加准确   */
}
#d1#1 p{
    /*.....*/
}
```






