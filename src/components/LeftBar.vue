<template>
  <div
    :class="`${
      leftBarClassEnum[$route.name === 'login' ? 1 : 0]
    } fixed z-10 h-screen flex flex-col bg-white dark:bg-gray-900 dark:text-white shadow-2xl`"
  >
    <div
      v-for="(item, index) in iconList"
      :key="index"
      @click="emit('enterPage', item.page)"
      class="left-bar-item flex flex-col items-center justify-center cursor-pointer dark:hover:bg-gray-800 dark:active:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 duration-400"
    >
      <n-icon
        :class="btnClassEnum[$route.path.includes(item.page) || $route.name === item.page ? 1 : 0]"
        size="32"
      >
        <component :is="item.icon" />
      </n-icon>
      <div class="left-bar-text font-thin">{{ item.name }}</div>
    </div>
    <div class="flex-1"></div>
    <div
      @click="emit('switchDarkMode')"
      class="left-bar-item w-20 h-20 flex items-center justify-center cursor-pointer dark:hover:bg-gray-800 dark:active:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 duration-400"
    >
      <n-icon class="left-bar-icon" size="32">
        <component :is="darkModeIconEnum[darkMode ? 1 : 0]" />
      </n-icon>
    </div>
    <div
      @click="emit('enterPage', 'settings')"
      class="left-bar-item w-20 h-20 flex items-center justify-center cursor-pointer dark:hover:bg-gray-800 dark:active:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 duration-400"
    >
      <n-icon :class="btnClassEnum[$route.path.includes('settings') ? 1 : 0]" size="32">
        <Settings />
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { NIcon } from "naive-ui";
import { Map2, ShoppingCart, Route, UserCircle, Settings } from "@vicons/tabler";
import { DarkModeFilled, LightModeFilled } from "@vicons/material";

const props = defineProps({
  darkMode: Boolean,
});
const emit = defineEmits(["enterPage", "switchDarkMode"]);

interface classType {
  [key: number | string]: any;
}

const darkModeIconEnum = ref<classType>({
  0: shallowRef(DarkModeFilled),
  1: shallowRef(LightModeFilled),
});

const btnClassEnum = ref<classType>({
  0: "left-bar-icon",
  1: "left-bar-icon left-bar-icon-current",
});

const leftBarClassEnum = ref<classType>({
  0: "left-bar-container",
  1: "left-bar-container-folded",
});

interface iconType {
  name: string;
  icon: any;
  page: string;
}

const iconList = ref<Array<iconType>>([
  {
    name: "地图",
    icon: shallowRef(Map2),
    page: "map",
  },
  {
    name: "日程",
    icon: shallowRef(Route),
    page: "route",
  },
  {
    name: "个人主页",
    icon: shallowRef(UserCircle),
    page: "account",
  },
  {
    name: "商场",
    icon: shallowRef(ShoppingCart),
    page: "mall",
  },
]);
</script>

<style scoped lang="less">
.left-bar-icon {
  transform: scale(0.9);
  color: var(--color-gray-500);
  transition-duration: 0.4s;
}

.left-bar-text {
  font-size: 0.8rem;
  height: 0.8rem;
  opacity: 1;
  transition-duration: 0.4s;
  transform: translateY(-10px);
  margin-top: 5px;
}

.left-bar-icon-current {
  transform: scale(1);
  color: var(--color-blue-600);
}

.left-bar-item:has(.left-bar-icon-current) {
  background-color: var(--color-blue-100);

  .left-bar-text {
    height: 0;
    opacity: 0;
    margin-top: 0;
    transform: translateY(0);
  }
}

@keyframes leftBarRight {
  from {
    transform: translateX(-80px);
  }
  to {
    transform: translateX(0);
  }
}

.left-bar-container {
  animation: leftBarRight 0.4s;
  width: var(--map-left-bar-width);
  transition: all 0.4s, width 0s, height 0s;
  z-index: 30;
}

.left-bar-container-folded {
  display: none;
}

.left-bar-item {
  width: var(--map-left-bar-width);
  height: var(--map-left-bar-width);
}

.dark {
  .left-bar-item:has(.left-bar-icon-current) {
    background-color: var(--color-gray-800);
  }

  .left-bar-icon {
    color: var(--color-gray-300);
  }

  .left-bar-icon-current {
    color: var(--color-blue-400);
  }
}

@keyframes bottomBarUp {
  from {
    transform: translateY(60px);
  }
  to {
    transform: translateY(0);
  }
}

@media (max-width: 520px) {
  .left-bar-container {
    animation: bottomBarUp 0.4s;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 50px;
    flex-direction: row;
    transition: all 0.4s, height 0s, width 0s;
  }

  .left-bar-item {
    height: 50px;
  }

  .left-bar-text {
    height: 0;
    opacity: 0;
    margin-top: 0;
    transform: translateY(0);
  }
}
</style>
