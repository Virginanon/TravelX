<template>
  <div class="right-container bg-white/80 dark:text-white dark:bg-gray-900/80 flex flex-col rounded-2xl">
    <div class="op-title">
      <div class="font-thin text-2xl">欢迎使用</div>
      <div class="font-bold text-blue-600 dark:text-blue-400 text-4xl mt-2">智能旅游系统</div>
      <div class="font-light text-sm mt-1 font-serif text-gray-400 dark:text-gray-200">Smart Travel with TravelAI</div>
    </div>
    <div class="op-common mt-4 bg-gray-100 dark:bg-gray-950 rounded-4xl">
      <div class="text-xl text-gray-600 dark:text-gray-300 font-light flex items-center">
        <span class="op-common-hint flex-1">从下面几个选项开始吧！</span>
        <span class="bg-blue-600 p-1 rounded-4xl text-white flex items-center justify-center box-border">
          <n-icon>
            <ChevronRight />
          </n-icon>
        </span>
      </div>
    </div>
    <div v-for="(item, index) in recommandList" :key="index"
      class="op-recommand text-gray-600 dark:text-gray-300 cursor-pointer duration-400 mt-2 box-border hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-2 h-15 flex justify-between items-center border-2 border-gray-200 dark:border-gray-500 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400">
      <div>
        <span class="op-recommand-text text-lg flex items-center">
          {{ item.name }}
        </span>
        <div class="op-recommand-hint text-sm font-light">{{ item.hint }}</div>
      </div>
      <div class="op-recommand-icon flex items-center justify-center">
        <n-icon>
          <ArrowRight />
        </n-icon>
      </div>
    </div>
    <div class="flex-1"></div>
    <div class="op-chat mt-5">
      <n-input size="large" round placeholder="或者，直接开始与模型对话吧">
        <template #prefix>
          <n-icon :component="FlashOnRound"></n-icon>
        </template>
        <template #suffix>
          <n-icon :component="Search"></n-icon>
        </template>
      </n-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChevronRight, ArrowRight, Search } from '@vicons/tabler';
import { FlashOnRound } from '@vicons/material';
import { NIcon, NInput, useMessage } from 'naive-ui';

const message = useMessage()
const props = withDefaults(
  defineProps<{
    darkMode: Boolean
  }>(),
  {
    darkMode: () => {
      return false
    }
  }
)

interface mapConfigType {
  zoom: number,
  center: Array<number>
}

const bShowAMap = ref<boolean>(false)


interface recommandType {
  name: string,
  hint: string
}

const recommandList = ref<Array<recommandType>>([
  {
    name: '想知道如何规划旅游路线？',
    hint: '点击查看示例'
  },
  {
    name: '想知道旅游目的地有哪些景点？',
    hint: '点击查看示例'
  },
  {
    name: '想知道旅游方案是否合理？',
    hint: '点击查看示例'
  },
])

onMounted(() => {
  setTimeout(() => {
    bShowAMap.value = true
  }, 500)
})
</script>

<style scoped lang="less">
.op-common {
  box-sizing: border-box;
  padding: 10px;
}

.op-recommand-hint {
  line-height: 0rem;
  opacity: 0;
  overflow: hidden;
  transition-duration: .4s;
}

.op-recommand-icon {
  transition-duration: .4s;
  border-radius: 10px;
}

.op-recommand-text {
  font-weight: 500;
  transition-duration: .4s;
}

.op-recommand:hover .op-recommand-hint {
  line-height: 1rem;
  opacity: 1;
}

.op-recommand:hover .op-recommand-text {
  font-weight: 700;
}

.op-recommand:hover .op-recommand-icon {
  padding: 10px;
  background-color: var(--color-blue-600);
  color: var(--color-white);
}

@media (max-width: 520px) {
  .op-recommand-text {
    font-size: 1rem;
  }

  .op-common-hint {
    font-size: 1rem;
  }

  .op-recommand {
    height: auto;
  }
}
</style>