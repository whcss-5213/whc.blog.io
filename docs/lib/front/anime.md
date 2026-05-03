# anime.js

```js
const animation = anime({
  targets: '.css-selector-demo .el',
  translateX: 250,
  duration: 1000, //（持续时间）
  delay: 1000, //（延迟）
  endDelay: 23, //（末端延迟）
  easing: easeInOutExpo, //（时间曲线）
  round: 1, //（数字格式） 1无小数 10 一位小数 100 两位小数
  direction: 'normal', // 'normal正向动画'  'reverse'反向动画 'alternate' 往返
  loop: true, //（循环） true 无限 3 三次
  autoplay: true, //（自动播放）false
  delay: anime.stagger(100), // 每个元素的延迟增加100毫秒。
  rotate: anime.stagger([-360, 360]), // 旋转将在-360deg到360deg之间均匀分布在所有元素之间
});
animation.play(); // 开始
animation.pause(); // 暂停
animation.restart(); // 重新开始
animation.reverse(); // 反转方向
animation.seek(100); // 跳转到特定时间（以毫秒为单位）。
animation.seek((scrollPercent / 100) * animation.duration);

anime.remove();
anime.set();
anime.get(el, 'width', 'rem');
anime.random(0, 270);

function loop(t) {
  animation.tick(t);
  customRAF = requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

anime.running; // []
```

## [动画的目标对象](https://www.animejs.cn/documentation/#targets)

- [CSS选择器](https://www.animejs.cn/documentation/#cssSelector)

  ```js
  anime({
    targets: '.css-selector-demo .el',
    translateX: 250,
  });
  ```

- [DOM元素 /元素序列](https://www.animejs.cn/documentation/#domNode)

  ```js
  var elements = document.querySelectorAll('.dom-node-demo .el');

  anime({
    targets: elements,
    translateX: 270,
  });
  ```

- [Javascript对象](https://www.animejs.cn/documentation/#JSobject)

  这个对象必须含有至少一个数字属性。

  ```js
  var logEl = document.querySelector('.battery-log');

  var battery = {
    charged: '0%',
    cycles: 120,
  };

  anime({
    targets: battery,
    charged: '100%',
    cycles: 130,
    round: 1,
    easing: 'linear',
    update: function () {
      logEl.innerHTML = JSON.stringify(battery);
    },
  });
  ```

- [数组](https://www.animejs.cn/documentation/#array)

  ```js
  var el = document.querySelector('.mixed-array-demo .el-01');

  anime({
    targets: [el, '.mixed-array-demo .el-02', '.mixed-array-demo .el-03'],
    translateX: 250,
  });
  ```

## [可动画的目标属性](https://www.animejs.cn/documentation/#properties)

- [CSS 属性](https://www.animejs.cn/documentation/#cssProperties)

- [CSS3 transforms 属性](https://www.animejs.cn/documentation/#CSStransforms)

- [Javascript对象属性](https://www.animejs.cn/documentation/#JSobjProp)

  ```javascript
  var objPropLogEl = document.querySelector('.js-object-log');

  var myObject = {
    prop1: 0,
    prop2: '0%',
  };

  anime({
    targets: myObject,
    prop1: 50,
    prop2: '100%',
    easing: 'linear',
    round: 1,
    update: function () {
      objPropLogEl.innerHTML = JSON.stringify(myObject);
    },
  });
  ```

- [DOM 属性](https://www.animejs.cn/documentation/#domAttr) 任何包含数值的DOM属性都可以设置动画。

- [SVG 属性](https://www.animejs.cn/documentation/#svgAttr)

## [动画基础参数](https://www.animejs.cn/documentation/#propertyParameters)

- [duraion（持续时间）](https://www.animejs.cn/documentation/#duration)

- [delay（延迟）](https://www.animejs.cn/documentation/#delay)

- [endDelay（末端延迟）](https://www.animejs.cn/documentation/#endDelay)

- [easing（时间曲线）](https://www.animejs.cn/documentation/#easing)

- [round（数字格式）](https://www.animejs.cn/documentation/#round)

- [特殊属性](https://www.animejs.cn/documentation/#specificPropParameters)

  使用Object作为值为动画的每个属性定义特定参数。
  未在Object中指定的其他属性继承自主动画。

  ```js
  anime({
    targets: '.specific-prop-params-demo .el',
    translateX: {
      value: 250,
      duration: 800,
    },
    rotate: {
      value: 360,
      duration: 1800,
      easing: 'easeInOutSine',
    },
    scale: {
      value: 2,
      duration: 1600,
      delay: 800,
      easing: 'easeInOutQuart',
    },
    delay: 250, // All properties except 'scale' inherit 250ms delay
  });
  ```

- [function 参数](https://www.animejs.cn/documentation/#functionBasedParameters)

  function 接受三个参数:

  | ARGUMENTS       | INFOS            |
  | --------------- | ---------------- |
  | `target`        | 当前动画目标元素 |
  | `index`         | 动画目标的索引   |
  | `targetsLength` | 总动画目标数     |

  ```js
  anime({
    targets: '.function-based-params-demo .el',
    translateX: 270,
    direction: 'alternate',
    loop: true,
    delay: function (el, i, l) {
      return i * 100;
    },
    endDelay: function (el, i, l) {
      return (l - i) * 100;
    },
  });
  ```

- [方向和循环](https://www.animejs.cn/documentation/#animationParameters)
- [direction（方向）](https://www.animejs.cn/documentation/#direction)
- [loop（循环）](https://www.animejs.cn/documentation/#loop)
- [autoplay（自动播放）](https://www.animejs.cn/documentation/#autoplay)

## [动画赋值方式](https://www.animejs.cn/documentation/#values)

- [无单位数值 ](https://www.animejs.cn/documentation/#unitlessValue) 如果原始值具有单位，则它将自动添加到动画值中。
  - [有单位数值](https://www.animejs.cn/documentation/#specificUnitValue) 强制动画使用某个单位并自动转换初始目标值。

- [相对数值](https://www.animejs.cn/documentation/#relativeValues)

- [颜色](https://www.animejs.cn/documentation/#colors)

- [设定动画初始值](https://www.animejs.cn/documentation/#fromToValues)

  强制动画以指定值开始。

  ```js
  anime({
    targets: '.el.from-to-values',
    translateX: [100, 250], // from 100 to 250
    delay: 500,
    direction: 'alternate',
    loop: true,
  });
  ```

- [函数返回数值](https://www.animejs.cn/documentation/#functionBasedPropVal)

  ```js
  translateY: function(el, index,length) {
      return 50 + (-50 * index);
  },
  ```

## [关键帧(keyframes)](https://www.animejs.cn/documentation/#keyframes)

如果关键帧内没有指定duration（持续时间），则每个关键帧的持续时间将等于动画总持续时间除以关键帧数。

```js
keyframes: [
  { value: 100, easing: 'easeOutExpo' },
  { value: 200, delay: 500 },
  { value: 300, duration: 1000 },
];
```

- [动画关键帧](https://www.animejs.cn/documentation/#animationKeyframes)

  ```js
  anime({
    targets: '.animation-keyframes-demo .el',
    keyframes: [
      { translateY: -40 },
      { translateX: 250 },
      { translateY: 40 },
      { translateX: 0 },
      { translateY: 0 },
    ],
    duration: 4000,
    easing: 'easeOutElastic(1, .8)',
    loop: true,
  });
  ```

- [属性关键帧](https://www.animejs.cn/documentation/#propertyKeyframes)

  ```js
  anime({
    targets: '.property-keyframes-demo .el',
    translateX: [
      { value: 250, duration: 1000, delay: 500 },
      { value: 0, duration: 1000, delay: 500 },
    ],
    translateY: [
      { value: -40, duration: 500 },
      { value: 40, duration: 500, delay: 1000 },
      { value: 0, duration: 500, delay: 1000 },
    ],
    scaleX: [
      { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
      { value: 1, duration: 900 },
      { value: 4, duration: 100, delay: 500, easing: 'easeOutExpo' },
      { value: 1, duration: 900 },
    ],
    scaleY: [
      { value: [1.75, 1], duration: 500 },
      { value: 2, duration: 50, delay: 1000, easing: 'easeOutExpo' },
      { value: 1, duration: 450 },
      { value: 1.75, duration: 50, delay: 1000, easing: 'easeOutExpo' },
      { value: 1, duration: 450 },
    ],
    easing: 'easeOutElastic(1, .8)',
    loop: true,
  });
  ```

## [交错动画(Stagger)](https://www.animejs.cn/documentation/#staggering)

- [基础交错动画](https://www.animejs.cn/documentation/#staggeringBasics)

  ```js
  delay: anime.stagger(100); // 每个元素的延迟增加100毫秒。第一个元素 0ms，第二个 100*1，第三个 100*2
  ```

- [设定交错开始值](https://www.animejs.cn/documentation/#staggeringStartValue)

  ```js
  delay: anime.stagger(100, { start: 500 }); // 延迟从500ms开始，然后每个元素增加100ms。
  ```

- [设定交错范围值](https://www.animejs.cn/documentation/#rangeValueStaggering)

  ```js
  rotate: anime.stagger([-360, 360]), // 旋转将在-360deg到360deg之间均匀分布在所有元素之间
  ```

- [交错动画开始位置](https://www.animejs.cn/documentation/#staggeringFrom)

  ```js
  delay: anime.stagger(100, { from: 'first' }); // 默认值
  delay: anime.stagger(100, { from: 'center' });
  delay: anime.stagger(100, { from: 'last' });
  delay: anime.stagger(100, { from: 4 });
  ```

- [交错动画方向](https://www.animejs.cn/documentation/#staggeringDirection)

  ```js
  delay: anime.stagger(100, { direction: 'normal' }); // 默认值
  delay: anime.stagger(100, { direction: 'reverse' });
  ```

- [交错的时间曲线](https://www.animejs.cn/documentation/#staggeringEasing)

  ```js
  delay: anime.stagger(300, { easing: 'easeOutQuad' });
  ```

- [网格交错](https://www.animejs.cn/documentation/#gridStaggering)

  ```js
  grid: [14, 5]; // 行数/列数
  anime({
    targets: '.staggering-grid-demo .el',
    scale: [
      { value: 0.1, easing: 'easeOutSine', duration: 500 },
      { value: 1, easing: 'easeInOutQuad', duration: 1200 },
    ],
    delay: anime.stagger(200, { grid: [14, 5], from: 'center' }),
  });
  ```

- [网格交错方向](https://www.animejs.cn/documentation/#gridAxisStaggering)

  ```js
  axis: 'x'; // x轴
  axis: 'y'; // y轴

  anime({
    targets: '.staggering-axis-grid-demo .el',
    translateX: anime.stagger(10, { grid: [14, 5], from: 'center', axis: 'x' }),
    translateY: anime.stagger(10, { grid: [14, 5], from: 'center', axis: 'y' }),
    rotateZ: anime.stagger([0, 90], {
      grid: [14, 5],
      from: 'center',
      axis: 'x',
    }),
    delay: anime.stagger(200, { grid: [14, 5], from: 'center' }),
    easing: 'easeInOutQuad',
  });
  ```

## [时间轴(Timeline)](https://www.animejs.cn/documentation/#timeline)

- [基础时间轴](https://www.animejs.cn/documentation/#timelineBasics)

  时间轴可让你将多个动画同步在一起。
  默认情况下，添加到时间轴的每个动画都会在上一个动画结束时开始。

  ```js
  // 使用默认参数创建时间轴
  var tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750,
  });

  // 增加子项
  tl.add({
    targets: '.basic-timeline-demo .el.square',
    translateX: 250,
  })
    .add({
      targets: '.basic-timeline-demo .el.circle',
      translateX: 250,
    })
    .add({
      targets: '.basic-timeline-demo .el.triangle',
      translateX: 250,
    });
  ```

- [时间轴偏移量](https://www.animejs.cn/documentation/#timelineOffsets)

  可以使用时间轴的 `.add()`函数的第二个可选参数指定时间偏移。它定义动画在时间轴中的开始时间，如果未指定偏移，则动画将在上一个动画结束后开始。
  偏移可以相对于最后一个动画，也可以相对于整个时间轴。

  | TYPE   | OFFSET   | EXAMPLE   | INFOS                                                               |
  | ------ | -------- | --------- | ------------------------------------------------------------------- |
  | String | `'+='`   | `'+=200'` | 相对位置：在上一个动画结束后200ms开始                               |
  | String | `'-='`   | `'-=200'` | 相对位置：在上一个动画结束前200ms开始                               |
  | Number | `Number` | `100`     | 绝对位置：无论时间轴的上一个动画何时结束，这个动画都在100毫秒处开始 |

  ```js
  // 使用默认参数创建时间轴
  var tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750,
  });

  tl.add({
    targets: '.offsets-demo .el.square',
    translateX: 250,
  })
    .add(
      {
        targets: '.offsets-demo .el.circle',
        translateX: 250,
      },
      '-=600'
    ) // 相对偏移量
    .add(
      {
        targets: '.offsets-demo .el.triangle',
        translateX: 250,
      },
      0
    ); // 绝对偏移量
  ```

- [参数继承](https://www.animejs.cn/documentation/#TLParamsInheritance)

  父时间轴实例中设置的参数将由所有子项继承。

  可以继承的参数：`targets`、`duration`、`delay`、`endDelay`、`round`。

## [动画控制](https://www.animejs.cn/documentation/#controls)

- [play / pause（暂停/播放）](https://www.animejs.cn/documentation/#playPause)

- [restart（重新开始）](https://www.animejs.cn/documentation/#restartAnim)

- [reverse（反转方向）](https://www.animejs.cn/documentation/#reverseAnim)

- [seek（瞬移）](https://www.animejs.cn/documentation/#seekAnim)

- [时间轴控制](https://www.animejs.cn/documentation/#TLcontrols)

  ```js
  timeline.play();
  timeline.pause();
  timeline.restart();
  timeline.seek(timeStamp);
  tl.seek(tl.duration * (controlsProgressEl.value / 100));
  ```

## [回调函数/事件函数](https://www.animejs.cn/documentation/#callbacks)

- [update](https://www.animejs.cn/documentation/#update)

  动画开始播放后，每帧都会触发此回调。

  ```js
  anime({
    targets: '.update-demo .el',
    translateX: 270,
    delay: 1000,
    direction: 'alternate',
    update: function (anim) {
      updates++;
      progressLogEl.value = 'progress : ' + Math.round(anim.progress) + '%';
      updateLogEl.value = 'updates : ' + updates;
    },
  });
  ```

- [begin/complete事件](https://www.animejs.cn/documentation/#beginComplete)

  当动画开始播放时，`begin()`回调被触发一次。

  动画完成后，会触发一次`complete()`回调。

  如果动画的持续时间为0，则`begin()`和`complete()`都会被调用。

- [loopBegin / loopComplete事件](https://www.animejs.cn/documentation/#loopBeginLoopComplete)

  每次循环开始时都会触发一次`loopBegin()` 回调。

  每次循环结束时，就会触发一次`loopComplete()`回调函数。

- [change事件](https://www.animejs.cn/documentation/#change)

  在动画的[delay](https://www.animejs.cn/documentation/#delay)和[endDelay](https://www.animejs.cn/documentation/#endDelay)之间的每个帧上触发此回调。

- [changeBegin / changeComplete事件](https://www.animejs.cn/documentation/#changeBeginChangeComplete)

  每次动画改变开始时都会触发`changeBegin()`回调

  每次动画改变结束时都会触发`changeComplete()`回调

  动画方向将影响触发`changeBegin()`和`changeComplete()`的顺序

- [promise](https://www.animejs.cn/documentation/#finishedPromise)

  动画完成后，每个动画实例都会返回一个完成的promise。

  ```javascript
  animation.finished.then(function () {
    // Do things...
  });
  ```

## [SVG](https://www.animejs.cn/documentation/#svg)

- [运动路径动画](https://www.animejs.cn/documentation/#motionPath)

- [变形动画](https://www.animejs.cn/documentation/#morphing)

- [画线动画](https://www.animejs.cn/documentation/#lineDrawing)

## [时间曲线(easing)](https://www.animejs.cn/documentation/#easings)

- [匀速](https://www.animejs.cn/documentation/#linearEasing) easing: 'linear'

- [不匀速](https://www.animejs.cn/documentation/#pennerFunctions)

- [三次贝塞尔](https://www.animejs.cn/documentation/#cubicBezier) `cubicBezier(x1, y1, x2, y2)`.

- [弹簧（spring）](https://www.animejs.cn/documentation/#springPhysicsEasing) easing: 'spring(mass, stiffness, damping, velocity)'

- [弹跳](https://www.animejs.cn/documentation/#elasticEasing)

  ```javascript
  amplitude: [1 - 10]; // 1
  period: [0.1 - 2]; // 0.5
  easing: 'easeOutElastic(amplitude, period)';
  ```

- [台阶式](https://www.animejs.cn/documentation/#stepEasing)

  定义动画到达其结束值所需的跳转次数。

  ```javascript
  easing: 'steps(numberOfSteps)';
  ```

- [自定义](https://www.animejs.cn/documentation/#customEasing)

  通过基于[function based value](https://www.animejs.cn/documentation/#functionBasedPropVal)返回自定义时间曲线函数。

  ```javascript
  easing: function() { return function(time) { return time * i} }
  ```

## [anime.js方法](https://www.animejs.cn/documentation/#easings)

- [删除目标](https://www.animejs.cn/documentation/#remove)

  ```js
  anime.remove(targets);
  ```

- [获取值](https://www.animejs.cn/documentation/#get)

  返回元素的原始值。

  ```js
  anime.get(target, propertyName, unit);
  ```

- [设定值](https://www.animejs.cn/documentation/#set)

  立即将值设置为指定的目标。

  ```js
  anime.set('.set-value-demo .el', {
    translateX: function () {
      return anime.random(50, 250);
    },
    rotate: function () {
      return anime.random(0, 360);
    },
  });
  ```

- [随机数](https://www.animejs.cn/documentation/#random)

  返回特定范围内的随机整数。

  ```js
  anime.random(minValue, maxValue);
  ```

- [tick](https://www.animejs.cn/documentation/#tick)

  使用外部`requestAnimationFrame`循环播放动画。

  ```javascript
  animation.tick(time);
  ```

  不要忘记将`autoplay`参数设置为`false`以防止*anime.js*内置RAF循环启动。

- [运行的对象](https://www.animejs.cn/documentation/#running)

  返回当前正在运行的所有活动*anime.js*实例的Array。

  ```javascript
  anime.running;
  ```
