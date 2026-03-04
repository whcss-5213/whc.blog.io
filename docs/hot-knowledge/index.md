---
titleTemplate: 热知识 热到烫人
layout: home
---

# 热知识 热到烫人

<div class="w-full border border-solid border-black rounded p-4">
  {{ count }}
  <button @click="count++">click me</button>
</div>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
