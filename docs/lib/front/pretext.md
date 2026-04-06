# Pretext

> https://pretextjs.net/zh

## 一、Pretext.js 是什么？

Pretext.js **在不触达 DOM 的情况下，快速准确地计算一段文本在特定字体和宽度下的高度、行数等布局信息**，完全避免使用 `getBoundingClientRect` 或 `offsetHeight` 等会触发浏览器重排（Reflow）的昂贵操作。



## 二、核心原理：冷路径与热路径分离

Pretext 的核心设计思路基于一个洞察：文本布局计算可以拆分为两个阶段，其中只有第一阶段需要"昂贵"的测量，第二阶段则可以纯算术完成。

```
传统 DOM 测量：            Pretext 两阶段：
每次测量都触发重排         prepare() 一次测量 + 缓存
↓                         ↓
昂贵 + 卡顿                layout() 纯算术计算
                          微秒级响应
```

### 阶段一：`prepare()` —— 冷路径（一次性重活）

`prepare()` 执行一次性的文本分析与字符测量，相对"昂贵"但只运行一次。主要工作包括：

- **文本规范化**：统一处理空白字符、制表符、换行符
- **分段（Segmentation）** ：使用 `Intl.Segmenter` 将文本按语义拆分成可换行的最小单元（词、字符、emoji 等），遵循 Unicode 标准中的断字规则（UAX #14），正确处理混合方向文本
- **字符测量**：调用 Canvas `measureText` API 测量每个"段"的宽度，这是整个过程中唯一一次调用浏览器原生测量能力的地方
- **缓存结果**：所有测量结果打包成一个不透明的句柄（opaque handle），供后续复用

`prepare()` 的性能表现优异，以 500 段文本的批处理为例，预处理时间约为 **19 毫秒**

### 阶段二：`layout()` —— 热路径（纯算术运算）

`layout()` 接收 `prepare()` 返回的句柄，以及目标宽度和行高参数，在内存中通过纯加减乘除的算术运算模拟换行过程。它**完全不依赖任何浏览器 API**，因此可以做到**微秒级别**的响应速度，非常适合高频调用场景（如窗口缩放、滚动等）。

**关键要求**：`prepare()` 传入的 `font` 字符串，必须与最终 CSS 中实际使用的字体声明**完全一致**（包括字体族名称、字重、字号等），否则测量结果会出现偏差。

```javascript
// ✅ 正确：CSS 和 prepare() 字体声明一致
// CSS: .text { font: 16px "Inter", sans-serif; }
const prepared = prepare(text, '16px "Inter", sans-serif');

// ❌ 错误：字体声明不一致会导致测量偏差
const prepared = prepare(text, '16px system-ui');
```

## 三、安装与引入

```bash
pnpm install @chenglou/pretext
```

```javascript
import {
  prepare,
  layout,
  prepareWithSegments,
  layoutWithLines,
} from '@chenglou/pretext';
```

## 四、API 参考

### 4.1 `prepare()` + `layout()`

这是最常用的基础 API，覆盖绝大多数业务场景。

#### `prepare(text: string, font: string, options?: PrepareOptions): PreparedHandle`

对文本进行预处理和测量，返回一个可复用的"句柄"。

| 参数      | 类型             | 说明                                                                             |
| --------- | ---------------- | -------------------------------------------------------------------------------- |
| `text`    | `string`         | 待测量的文本内容                                                                 |
| `font`    | `string`         | 字体声明，必须与 CSS 中实际使用的字体完全一致（如 `'16px "Inter", sans-serif'`） |
| `options` | `PrepareOptions` | 可选配置（见下方表格）                                                           |

```javascript
const handle = prepare(
  'Hello Pretext! 这是一段文本。',
  '16px "Inter", sans-serif'
);
```

`options` 可选配置：

| 属性         | 类型                                                        | 默认值     | 说明                                 |
| ------------ | ----------------------------------------------------------- | ---------- | ------------------------------------ |
| `whiteSpace` | `'normal' \| 'pre' \| 'pre-wrap' \| 'pre-line' \| 'nowrap'` | `'normal'` | 空白字符处理策略       |
| `language`   | `string`                                                    | 自动检测   | 指定文本语言，用于优化分段和断行规则 |
| `rtl`        | `boolean`                                                   | `false`    | 是否为从右到左书写方向的文本         |

#### `layout(handle: PreparedHandle, maxWidth: number, lineHeight: number): LayoutResult`

基于预处理句柄，计算在指定容器宽度下的布局结果。这是一个纯算术运算，速度极快。

| 参数         | 类型             | 说明                   |
| ------------ | ---------------- | ---------------------- |
| `handle`     | `PreparedHandle` | `prepare()` 返回的句柄 |
| `maxWidth`   | `number`         | 容器最大宽度（像素）   |
| `lineHeight` | `number`         | 行高（像素）           |

```javascript
const { height, lineCount } = layout(handle, 300, 24);
console.log(`文本高度: ${height}px, 行数: ${lineCount}`);
```

`LayoutResult` 返回值：

| 属性        | 类型     | 说明                 |
| ----------- | -------- | -------------------- |
| `height`    | `number` | 文本块总高度（像素） |
| `lineCount` | `number` | 总行数               |

**代码示例：**

```javascript
import { prepare, layout } from '@chenglou/pretext';

// 1. 预处理（只执行一次）
const handle = prepare('AGI 春天到了。بدأت الرحلة', '16px "Inter", sans-serif');

// 2. 在不同容器宽度下快速计算布局
const resultMobile = layout(handle, 280, 24); // 手机屏幕
const resultTablet = layout(handle, 540, 26); // 平板屏幕
const resultDesktop = layout(handle, 800, 28); // 桌面屏幕

console.log(
  `手机: ${resultMobile.lineCount}行, 平板: ${resultTablet.lineCount}行`
);
```

### 4.2 `prepareWithSegments()` + `layoutWithLines()` / `layoutNextLine()`

当需要**逐行渲染**（如 Canvas 绘制、SVG 文本、自定义环绕排版等）时，可以使用高级 API 获取每一行的精确内容和位置坐标。

#### `prepareWithSegments(text: string, font: string, options?: PrepareOptions): PreparedSegments`

与 `prepare()` 类似，但返回更细粒度的分段数据，便于逐行布局。

#### `layoutWithLines(handle: PreparedSegments, maxWidth: number, lineHeight: number): LinesResult`

基于 `prepareWithSegments()` 返回的句柄，返回包含每一行详细信息的布局结果。

```javascript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const segments = prepareWithSegments(longText, '16px "Inter"');
const layout = layoutWithLines(segments, 400, 24);

// 遍历每一行，进行自定义渲染
for (const line of layout.lines) {
  console.log(line.segments); // 该行包含的文本片段数组
  console.log(line.width); // 该行的实际宽度
}
```

`layoutWithLines()` 返回的 `LinesResult` 结构：

| 属性        | 类型          | 说明                 |
| ----------- | ------------- | -------------------- |
| `lines`     | `Array<Line>` | 每一行的详细信息数组 |
| `height`    | `number`      | 文本块总高度         |
| `lineCount` | `number`      | 总行数               |

每个 `Line` 对象包含：

| 属性       | 类型             | 说明                   |
| ---------- | ---------------- | ---------------------- |
| `segments` | `Array<Segment>` | 该行包含的文本片段列表 |
| `width`    | `number`         | 该行的实际宽度（像素） |

#### `layoutNextLine(segments: PreparedSegments, startIndex: number, maxWidth: number): NextLineResult`

流式布局 API，支持按行逐步计算布局，适合需要动态追加内容或实现无限滚动场景。

```javascript
let currentIndex = 0;
let allLines = [];

while (currentIndex < segments.totalLength) {
  const lineResult = layoutNextLine(segments, currentIndex, 400);
  allLines.push(lineResult);
  currentIndex = lineResult.nextStartIndex;
}
```

`NextLineResult` 返回值：

| 属性             | 类型             | 说明                 |
| ---------------- | ---------------- | -------------------- |
| `segments`       | `Array<Segment>` | 当前行的文本片段列表 |
| `width`          | `number`         | 当前行的宽度         |
| `nextStartIndex` | `number`         | 下一行的起始索引位置 |

## 五、典型使用场景

### 1. 虚拟滚动列表中的文本高度预测

在虚拟滚动列表中，Pretext 可以在渲染前精确计算出每一项的高度，避免滚动条跳动，实现 60fps 的流畅滚动。

```javascript
// 为列表中的每条消息预计算高度
const items = messages.map(msg => ({
  data: msg,
  handle: prepare(msg.text, '14px system-ui'),
  height: null, // 高度将在布局时计算
}));

function updateItemHeights(containerWidth) {
  for (const item of items) {
    const { height } = layout(item.handle, containerWidth - 32, 20);
    item.height = height;
  }
  // 重新计算虚拟列表的总高度和可见范围
}
```

### 2. 实时 AI 聊天界面

在 AI 流式输出文本的场景中，Pretext 可以在内容完全渲染前预计算文本块的高度，防止气泡在内容流入时发生跳跃或偏移。

```javascript
let streamHandle = null;
let streamBuffer = '';

function onStreamChunk(chunk) {
  streamBuffer += chunk;
  // 流式更新时重新计算布局
  if (!streamHandle) {
    streamHandle = prepare(streamBuffer, '16px system-ui');
  } else {
    // 注意：文本变化时需要重新 prepare（此处仅示意）
    streamHandle = prepare(streamBuffer, '16px system-ui');
  }
  const { height } = layout(streamHandle, maxWidth, 24);
  updateBubbleHeight(height);
}
```

> **💡 提示**：在流式场景中，每次 `prepare` 会重新执行测量，建议采用节流策略控制调用频率。

### 3. Canvas/SVG 自定义文本渲染

结合高级 API，可以将文本逐行绘制到 Canvas 上。

```javascript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const ctx = canvas.getContext('2d');
const segments = prepareWithSegments(text, '16px system-ui');
const layout = layoutWithLines(segments, 400, 24);

let y = 0;
for (const line of layout.lines) {
  let x = 0;
  for (const seg of line.segments) {
    ctx.fillText(seg.text, x, y);
    x += seg.width;
  }
  y += 24;
}
```

## 六、注意事项与最佳实践

### 字体配置一致性

传递给 `prepare()` 的 `font` 字符串必须与 CSS 中实际使用的字体声明**完全一致**。差异会导致测量结果与实际渲染高度不符。

### 何时需要重新 `prepare()`

`prepare()` 的结果仅在以下条件保持不变时有效：

- 文本内容不变
- 字体声明不变
- 文本语言/书写方向不变

**以下情况必须重新调用 `prepare()`**：

1. 文本内容发生变化（如用户输入、新消息）
2. 字体声明发生变化（如字号、字体族、字重）
3. 容器样式中的 `whiteSpace` 策略发生变化

### `layout()` 可以无限次复用

只要 `prepare()` 返回的句柄不变，`layout()` 可以在不同 `maxWidth` 和 `lineHeight` 下**无限次复用**，这是实现高性能响应式布局的关键。

### 字体加载时机

如果使用了自定义字体或 Web Font，需要等待字体加载完成后再调用 `prepare()`，否则测量结果可能使用 fallback 字体。可以使用 Font Loading API 或 `document.fonts.ready`：

```javascript
await document.fonts.ready; // 等待所有字体加载完成
const handle = prepare(text, '16px "CustomFont", sans-serif');
```

## 文字环绕图片

<script setup>
import Pretext from '../../component/pretext.vue'
</script>
<Pretext />

::: code-group

```html
<template>
  <div class="text-container">
    <!-- 可拖拽图片，使用绝对定位 -->
    <img
      :src="imageUrl"
      class="draggable-image"
      :style="{
        left: imagePos.x + 'px',
        top: imagePos.y + 'px',
        width: imageSize.width + 'px',
        height: imageSize.height + 'px'
      }"
      draggable="false"
      @mousedown="startDrag"
    />

    <!-- 文本层，每行文字使用绝对定位 -->
    <div class="text-layer">
      <span
        v-for="(line, index) in renderedLines"
        :key="index"
        class="text-line"
        :style="{
          top: line.y + 'px',
          left: line.x + 'px'
        }"
      >
        {{ line.text }}
      </span>
    </div>
  </div>
</template>
```

```js
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

// 1. 预处理文本：一次性分析文本，测量字形宽度
// prepareWithSegments 返回的结构包含分段信息，用于后续逐行布局
const preparedText = prepareWithSegments(text, '16px system-ui');

// 2. 计算环绕布局的核心算法
function calculateLayout() {
  const lines = [];
  const imgLeft = imagePos.x;
  const imgRight = imagePos.x + imageSize.width;
  const imgTop = imagePos.y;
  const imgBottom = imagePos.y + imageSize.height;

  // 计算图片两侧可用宽度
  const leftWidth = imgLeft;
  const rightWidth = containerWidth - imgRight;
  const hasLeftArea = leftWidth >= 30;
  const hasRightArea = rightWidth >= 30;

  let cursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;

  while (true) {
    const lineBottom = y + lineHeight;
    // 判断当前行是否与图片重叠
    const overlapsImage = y < imgBottom && lineBottom > imgTop;

    if (!overlapsImage) {
      // 不与图片重叠：使用全宽布局
      const line = layoutNextLine(preparedText, cursor, containerWidth);
      if (line === null) break;
      lines.push({ text: line.text, x: 0, y: y });
      cursor = line.end;
    } else {
      // 与图片重叠：实现环绕效果
      if (hasLeftArea && hasRightArea) {
        // 两侧都有空间：左侧和右侧各渲染一行
        const leftLine = layoutNextLine(preparedText, cursor, leftWidth);
        if (leftLine === null) break;
        lines.push({ text: leftLine.text, x: 0, y: y });

        // 右侧行从左侧行的结束位置继续
        const rightLine = layoutNextLine(
          preparedText,
          leftLine.end,
          rightWidth
        );
        if (rightLine !== null) {
          lines.push({ text: rightLine.text, x: imgRight, y: y });
          cursor = rightLine.end;
        } else {
          cursor = leftLine.end;
        }
      } else if (hasLeftArea) {
        // 只有左侧有空间
        const line = layoutNextLine(preparedText, cursor, leftWidth);
        if (line === null) break;
        lines.push({ text: line.text, x: 0, y: y });
        cursor = line.end;
      } else if (hasRightArea) {
        // 只有右侧有空间
        const line = layoutNextLine(preparedText, cursor, rightWidth);
        if (line === null) break;
        lines.push({ text: line.text, x: imgRight, y: y });
        cursor = line.end;
      }
    }
    y += lineHeight;
  }
  return lines;
}

// 3. 拖拽处理：更新图片位置后重新计算布局
function onDrag(e) {
  imagePos.x = e.clientX - dragOffset.x;
  imagePos.y = e.clientY - dragOffset.y;
  calculateLayout(); // 实时重新计算文字布局
}
```

```css
.text-container {
  position: relative;
  min-height: 400px;
  background: white;
}

/* 图片使用绝对定位，可自由拖拽 */
.draggable-image {
  position: absolute;
  cursor: move;
  user-select: none;
  z-index: 10;
}

/* 文本层作为定位容器 */
.text-layer {
  position: relative;
  width: 100%;
}

/* 每行文字使用绝对定位，由 JS 计算位置 */
.text-line {
  position: absolute;
  white-space: pre;
  font-size: 16px;
  line-height: 24px;
}
```

:::
