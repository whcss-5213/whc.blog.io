<!-- # 2048 -->

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const size = 4
const tileSize = 68
const gap = 8

const grid = ref([])
const score = ref(0)
const bestScore = ref(0)
const isMerging = ref(false)
const addScore = ref(0)
const addScoreShow = ref(false)

let startX = 0
let startY = 0

// 初始化
function init() {
  grid.value = Array.from({ length: size }, () => Array(size).fill(0))
  score.value = 0
  addRandom()
  addRandom()
}

// 随机生成 2/4
function addRandom() {
  const list = []
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid.value[i][j] === 0) list.push([i, j])
    }
  }
  if (!list.length) return
  const [i, j] = list[Math.random() * list.length | 0]
  grid.value[i][j] = Math.random() < 0.9 ? 2 : 4
}

// 合并一行
function mergeLine(line) {
  let arr = line.filter(v => v)
  let res = []
  let add = 0
  let i = 0
  while (i < arr.length) {
    if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
      const val = arr[i] * 2
      res.push(val)
      add += val
      i += 2
    } else {
      res.push(arr[i])
      i++
    }
  }
  while (res.length < size) res.push(0)
  return { res, add }
}

// 转置
function transpose(g) {
  return g[0].map((_, c) => g.map(r => r[c]))
}

// 方向
function moveLeft() {
  let total = 0
  grid.value = grid.value.map(row => {
    const m = mergeLine(row)
    total += m.add
    return m.res
  })
  return total
}
function moveRight() {
  let total = 0
  grid.value = grid.value.map(row => {
    const rev = [...row].reverse()
    const m = mergeLine(rev)
    total += m.add
    return m.res.reverse()
  })
  return total
}
function moveUp() {
  const t = transpose(grid.value)
  let total = 0
  const newT = t.map(row => {
    const m = mergeLine(row)
    total += m.add
    return m.res
  })
  grid.value = transpose(newT)
  return total
}
function moveDown() {
  const t = transpose(grid.value)
  let total = 0
  const newT = t.map(row => {
    const rev = [...row].reverse()
    const m = mergeLine(rev)
    total += m.add
    return m.res.reverse()
  })
  grid.value = transpose(newT)
  return total
}

// 执行移动
function doMove(fn) {
  const old = JSON.stringify(grid.value)
  const add = fn()

  if (add > 0) {
    addScore.value = add
    addScoreShow.value = true
    setTimeout(() => addScoreShow.value = false, 600)
  }

  if (JSON.stringify(grid.value) !== old) {
    score.value += add
    isMerging.value = true
    setTimeout(() => isMerging.value = false, 100)
    addRandom()
    checkOver()
  }
}

// 键盘
function onKey(e) {
  switch (e.key) {
    case 'ArrowUp': doMove(moveUp); break
    case 'ArrowDown': doMove(moveDown); break
    case 'ArrowLeft': doMove(moveLeft); break
    case 'ArrowRight': doMove(moveRight); break
  }
}

// 滑动
function onTouchStart(e) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - startX
  const dy = e.changedTouches[0].clientY - startY
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? doMove(moveRight) : doMove(moveLeft)
  } else {
    dy > 0 ? doMove(moveDown) : doMove(moveUp)
  }
}

// 结束判断
function checkOver() {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (!grid.value[i][j]) return

  for (let i = 0; i < size; i++)
    for (let j = 0; j < size - 1; j++)
      if (grid.value[i][j] === grid.value[i][j + 1]) return

  const t = transpose(grid.value)
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size - 1; j++)
      if (t[i][j] === t[i][j + 1]) return

  setTimeout(() => alert('游戏结束！得分：' + score.value), 200)
}

// 重新开始
function restart() {
  init()
}

// 最高分
watch(score, val => {
  if (val > bestScore.value) {
    bestScore.value = val
    localStorage.setItem('best2048', val)
  }
})

onMounted(() => {
  bestScore.value = +localStorage.getItem('best2048') || 0
  init()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>
<template>
  <div class="game-2048">
    <div class="header">
      <h1>2048</h1>
      <div class="scores">
        <div class="score">得分：{{ score }}</div>
        <div class="best">最高分：{{ bestScore }}</div>
      </div>
      <button class="restart" @click="restart">重新开始</button>
    </div>

    <div class="grid" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <!-- 底板 -->
      <div class="cell-bg" v-for="i in 16" :key="i"></div>

      <!-- 方块 -->
      <template v-for="(row, i) in grid">
        <div v-for="(val, j) in row" :key="`${i}-${j}-${val}`" class="tile"
          :class="[`tile-${val}`, { merge: isMerging }]" v-show="val !== 0" :style="{
            top: `${i * (tileSize + gap) + gap}px`,
            left: `${j * (tileSize + gap) + gap}px`,
            width: `${tileSize}px`,
            height: `${tileSize}px`
          }">
          {{ val }}
        </div>
      </template>
    </div>

    <div class="score-add" :class="{ show: addScoreShow }">
      +{{ addScore }}
    </div>
  </div>
</template>
<style scoped>
.game-2048 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #faf8ef;
  min-height: 100vh;
  user-select: none;
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 16px;
}

h1 {
  font-size: 36px;
  color: #776e65;
  margin: 0 0 8px;
}

.scores {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #776e65;
}

.restart {
  padding: 8px 16px;
  background: #8f7a66;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.grid {
  position: relative;
  width: calc(4 * 68px + 5 * 8px);
  height: calc(4 * 68px + 5 * 8px);
  background: #bbada0;
  border-radius: 8px;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
}

.cell-bg {
  background: #cdc1b4;
  border-radius: 4px;
}

.tile {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #776e65;
  border-radius: 4px;
  transition: transform 0.14s ease;
  animation: appear 0.16s ease;
}

.tile.merge {
  animation: merge 0.2s ease;
}

@keyframes appear {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes merge {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}

.score-add {
  position: fixed;
  top: 140px;
  font-size: 20px;
  color: #8f7a66;
  font-weight: bold;
  opacity: 0;
  transition: all 0.6s ease;
}

.score-add.show {
  opacity: 1;
  transform: translateY(-20px);
}

.tile-2 {
  background: #eee4da;
}

.tile-4 {
  background: #ede0c8;
}

.tile-8 {
  background: #f2b179;
  color: #fff;
}

.tile-16 {
  background: #f59563;
  color: #fff;
}

.tile-32 {
  background: #f67c5f;
  color: #fff;
}

.tile-64 {
  background: #f65e3b;
  color: #fff;
}

.tile-128 {
  background: #edcf72;
  color: #fff;
}

.tile-256 {
  background: #edcc61;
  color: #fff;
}

.tile-512 {
  background: #ecc850;
  color: #fff;
}

.tile-1024,
.tile-2048 {
  background: #edc22e;
  color: #fff;
}
</style>
