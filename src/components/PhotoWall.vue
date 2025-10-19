<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  images: string[]
  columns?: number
  speed?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2,
  speed: 1
})

// 添加响应式列数
const columns = ref(props.columns)

const updateColumns = () => {
  columns.value = window.innerWidth < 768 ? 1 : props.columns
}

const containerRef = ref<HTMLElement>()
const scrollIntervals = ref<NodeJS.Timeout[]>([])

const getRandomStyle = () => {
  return {
    '--delay': `${Math.random() * 2}s`,       // 0~2秒随机延迟
    '--duration': `${0.5 + Math.random() * 1.5}s` // 0.5~2秒随机持续时间
  }
}

onMounted(() => {
  if (!containerRef.value) return

  updateColumns()
  window.addEventListener('resize', updateColumns)

  const columnElements = containerRef.value.querySelectorAll('.photo-column')
  columnElements.forEach((col, index) => {
    const direction = index % 2 === 0 ? -1 : 1
    const content = col.querySelector('.photo-stack') as HTMLElement
    const itemHeight = content.firstElementChild?.clientHeight || 0
    
    // 生成随机速度系数 (0.8 ~ 1.2)
    const speedVariation = 0.8 + Math.random() * 0.4
    const actualSpeed = props.speed * speedVariation

    col.scrollTop = index * itemHeight

    const scroll = () => {
      col.scrollTop += direction * actualSpeed

      if (direction === 1 && col.scrollTop >= content.clientHeight / 2) {
        col.scrollTop -= content.clientHeight / 2
      } else if (direction === -1 && col.scrollTop <= 0) {
        col.scrollTop += content.clientHeight / 2
      }
      
      requestAnimationFrame(scroll)
    }
    
    scroll()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
  scrollIntervals.value.forEach(clearInterval)
})
</script>

<template>
  <div ref="containerRef" class="photo-wall">
    <div
      v-for="(col, colIndex) in columns"
      :key="colIndex"
      class="photo-column"
      :style="{ '--direction': colIndex % 2 === 0 ? -1 : 1 }"
    >
      <div class="photo-stack">
        <img
          v-for="(img, imgIndex) in images"
          :key="imgIndex"
          :src="img"
          :style="getRandomStyle()"
          class="photo-item"
        />
        <!-- 复制一份实现无缝循环 -->
        <img
          v-for="(img, imgIndex) in images"
          :key="`dup-${imgIndex}`"
          :src="img"
          :style="getRandomStyle()"
          class="photo-item"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-wall {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.photo-column {
  flex: 1;
  overflow: hidden;
  height: 100%;
  margin: 0 5px;
}

.photo-stack {
  display: flex;
  flex-direction: column;
}

.photo-item {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
  opacity: 0;  
  animation: fadeIn var(--duration) ease var(--delay) forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .photo-wall {
    flex-direction: column;
  }
  
  .photo-column {
    width: 100%;
    height: 50vh; /* 每列高度减半 */
  }

  .photo-item {
    margin-bottom: 5px; /* 缩小间距 */
  }
}
</style>