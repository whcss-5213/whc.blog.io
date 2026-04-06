<template>
  <div class="pretext-demo">
    <div class="controls">
      <n-input v-model:value="text" type="textarea" placeholder="输入文本内容" :rows="4" class="text-input" />
    </div>

    <div ref="containerRef" class="text-container" :style="{ width: containerWidth + 'px' }">
      <img v-if="showImage" ref="imageRef" :src="currentImageUrl" class="draggable-image" :style="{
        left: imagePos.x + 'px',
        top: imagePos.y + 'px',
        width: imageSize.width + 'px',
        height: imageSize.height + 'px'
      }" draggable="false" @mousedown="startDrag" />

      <div class="text-layer" ref="textLayerRef">
        <span v-for="(line, index) in renderedLines" :key="index" class="text-line" :style="{
          top: line.y + 'px',
          left: line.x + 'px'
        }">
          {{ line.text }}
        </span>
      </div>
    </div>

    <div class="info-panel">
      <p>图片位置: ({{ Math.round(imagePos.x) }}, {{ Math.round(imagePos.y) }})</p>
      <p>图片尺寸: {{ imageSize.width }} x {{ imageSize.height }}</p>
      <p>文本行数: {{ renderedLines.length }}</p>
      <p>容器宽度: {{ containerWidth }}px</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { NInput } from 'naive-ui'
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'

const text = ref('Pretext 是一个纯 JavaScript/TypeScript 库，用于多行文本测量和布局。它快速、准确，支持各种语言。Pretext 避免了 DOM 测量（如 getBoundingClientRect、offsetHeight）的需求，这些操作会触发布局回流，是浏览器中最昂贵的操作之一。它实现了自己的文本测量逻辑，使用浏览器自己的字体引擎作为基本事实。拖动图片可以看到文字会自动环绕图片排列，这就是 Pretext 强大的实时布局计算能力的体现。你可以尝试输入不同的文本内容，或者更换图片，观察文字布局的实时变化。')

const imageUrl = ref('https://picsum.photos/200/150')
const currentImageUrl = ref('https://picsum.photos/200/150')
const showImage = ref(true)

const containerRef = ref(null)

const containerWidth = ref(600)
const lineHeight = ref(24)
const fontSize = ref('16px')
const fontFamily = ref('system-ui, -apple-system, sans-serif')

const imagePos = reactive({ x: 50, y: 20 })
const imageSize = reactive({ width: 150, height: 120 })

const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })

const renderedLines = ref([])

const fontString = computed(() => `${fontSize.value} ${fontFamily.value}`)

let preparedText = null

function prepareText() {
  if (text.value) {
    preparedText = prepareWithSegments(text.value, fontString.value)
  } else {
    preparedText = null
  }
}

function calculateLayout() {
  if (!preparedText) {
    renderedLines.value = []
    return
  }

  const lines = []
  const imgLeft = imagePos.x
  const imgRight = imagePos.x + imageSize.width
  const imgTop = imagePos.y
  const imgBottom = imagePos.y + imageSize.height

  const leftWidth = imgLeft
  const rightWidth = containerWidth.value - imgRight
  const hasLeftArea = leftWidth >= 30
  const hasRightArea = rightWidth >= 30

  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = 0

  while (true) {
    const lineBottom = y + lineHeight.value
    const overlapsImage = y < imgBottom && lineBottom > imgTop

    if (!overlapsImage) {
      const line = layoutNextLine(preparedText, cursor, containerWidth.value)
      if (line === null) break

      lines.push({
        text: line.text,
        x: 0,
        y: y
      })
      cursor = line.end
    } else {
      if (hasLeftArea && hasRightArea) {
        const leftLine = layoutNextLine(preparedText, cursor, leftWidth)
        if (leftLine === null) break

        lines.push({
          text: leftLine.text,
          x: 0,
          y: y
        })

        const rightLine = layoutNextLine(preparedText, leftLine.end, rightWidth)
        if (rightLine !== null) {
          lines.push({
            text: rightLine.text,
            x: imgRight,
            y: y
          })
          cursor = rightLine.end
        } else {
          cursor = leftLine.end
        }
      } else if (hasLeftArea) {
        const line = layoutNextLine(preparedText, cursor, leftWidth)
        if (line === null) break

        lines.push({
          text: line.text,
          x: 0,
          y: y
        })
        cursor = line.end
      } else if (hasRightArea) {
        const line = layoutNextLine(preparedText, cursor, rightWidth)
        if (line === null) break

        lines.push({
          text: line.text,
          x: imgRight,
          y: y
        })
        cursor = line.end
      } else {
        cursor = { segmentIndex: 0, graphemeIndex: 0 }
      }
    }

    y += lineHeight.value
  }

  renderedLines.value = lines
}

function startDrag(e) {
  isDragging.value = true
  dragOffset.x = e.clientX - imagePos.x
  dragOffset.y = e.clientY - imagePos.y

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)

  e.preventDefault()
}

function onDrag(e) {
  if (!isDragging.value) return

  const containerRect = containerRef.value?.getBoundingClientRect()
  if (!containerRect) return

  let newX = e.clientX - dragOffset.x
  let newY = e.clientY - dragOffset.y

  newX = Math.max(0, Math.min(newX, containerWidth.value - imageSize.width))
  newY = Math.max(0, newY)

  imagePos.x = newX
  imagePos.y = newY

  calculateLayout()
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}



watch(text, () => {
  prepareText()
  calculateLayout()
})

watch([containerWidth, lineHeight], () => {
  calculateLayout()
})

onMounted(() => {
  prepareText()
  calculateLayout()

  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.pretext-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-input {
  width: 100%;
}

.image-controls {
  display: flex;
  gap: 12px;
}

.url-input {
  flex: 1;
}

.text-container {
  position: relative;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.draggable-image {
  position: absolute;
  cursor: move;
  user-select: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: box-shadow 0.2s;
}

.draggable-image:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.draggable-image:active {
  cursor: grabbing;
}

.text-layer {
  position: relative;
  width: 100%;
  min-height: 400px;
  padding: 10px 0;
}

.text-line {
  position: absolute;
  white-space: pre;
  font-size: v-bind(fontSize);
  font-family: v-bind(fontFamily);
  line-height: v-bind('lineHeight + "px"');
  color: #333;
}

.info-panel {
  display: flex;
  gap: 20px;
  padding: 12px;
  background: #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.info-panel p {
  margin: 0;
}
</style>
