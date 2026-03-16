<template>
  <div class="petals-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let interval = null

onMounted(() => {
  const container = document.querySelector('.petals-container')
  if (!container) return

  for (let i = 0; i < 200; i++) {
    setTimeout(() => createPetal(), i * 100)
  }

  // 持续补充花瓣
  interval = setInterval(createPetal, 3000)
})

onUnmounted(() => clearInterval(interval))

function createPetal() {
  const container = document.querySelector('.petals-container')
  if (!container) return

  const petal = document.createElement('div')
  petal.classList.add('petal')

  // 随机大小、位置、动画时长
  const size = Math.random() * 10 + 5
  const left = Math.random() * 100
  const duration = Math.random() * 8 + 6
  const rotate = Math.random() * 360

  petal.style.width = `${size}px`
  petal.style.height = `${size}px`
  petal.style.left = `${left}%`
  petal.style.animationDuration = `${duration}s`
  petal.style.transform = `rotate(${rotate}deg)`

  container.appendChild(petal)

  // 动画结束自动删除
  setTimeout(() => petal.remove(), duration * 1000)
}
</script>

<style>
.petals-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -20px;
  opacity: 0.8;
  background: var(--petal-color, #ffd1e0);
  border-radius: 100% 0 100% 50%;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.8;
  }

  100% {
    transform: translateY(100vh) translateX(80px) rotate(720deg);
    opacity: 0;
  }
}
</style>