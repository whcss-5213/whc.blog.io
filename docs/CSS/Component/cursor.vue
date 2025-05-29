<template>
  <div class="w-full w flex flex-wrap gap-4 mt-[20px]">
    <el-card
        @click="clipboard(i)"
        shadow="hover"
        :style="{cursor:i}"
        class=" flex items-center justify-center"
        v-for="i in table"
    >
      {{ i }}
    </el-card>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {ElCard, ElMessage} from "element-plus"

const clipboard = i => {
  navigator.clipboard.writeText(i).then(() => {
        ElMessage({
          message: "复制成功",
          type: "success",
        })
      }
  ).catch(() => {
    ElMessage.error('复制失败')
  })
}

let table = ref([
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