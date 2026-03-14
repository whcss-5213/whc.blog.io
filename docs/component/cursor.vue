<template>
  <div class="w-full flex flex-wrap gap-4 mt-[20px]">
    <!-- 替换为 Naive UI Card -->
    <n-card @click="clipboard(i)" hoverable :style="{ cursor: i }"
      class="flex items-center justify-center w-[100px] h-[100px]" v-for="i in table" :key="i" :bordered="false">
      {{ i }}
    </n-card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useMessage, NCard } from "naive-ui"
// const { useMessage, NCard } = naive


// const message = useMessage()

const clipboard = i => {
  navigator.clipboard.writeText(i).then(() => {
    // message.success("复制成功")
  }).catch(() => {
    // message.error("复制失败")
  })
}

const table = ref([
  "auto",
  "default",
  "pointer",
  "wait",
  "text",
  "move",
  "help",
  "not-allowed",
  "none",
  "context-menu",
  "progress",
  "cell",
  "crosshair",
  "vertical-text",
  "alias",
  "copy",
  "no-drop",
  "grab",
  "grabbing",
  "all-scroll",
  "col-resize",
  "row-resize",
  "n-resize",
  "e-resize",
  "s-resize",
  "w-resize",
  "ne-resize",
  "nw-resize",
  "se-resize",
  "sw-resize",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "zoom-in",
  "zoom-out"
])
</script>