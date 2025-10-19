<template>
  <div
    class="personal-container right-container bg-white/80 dark:text-white dark:bg-gray-900/80 flex flex-col"
  >
    <h2 class="user-container__header text-4xl font-light text-blue-600 dark:text-blue-400">
      <Logo small-name="个人主页" horizontal-name />
    </h2>

    <div class="user-container__avatar"></div>

    <main class="flex flex-1 gap-5">
      <nav class="w-70 shrink-0 h-full">
        <div
          v-for="nav in personalNav"
          :key="nav.name"
          class="personal-container__nav p-2 rounded-sm flex items-center text-sm gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          :class="$route.path.includes(nav.name) ? 'bg-gray-200 dark:bg-gray-800' : ''"
          @click="$router.push({ name: nav.name })"
        >
          <n-icon :size="20" :component="nav.icon" />
          {{ nav.title }}
        </div>
      </nav>

      <div class="flex-1">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from "naive-ui";
import { User } from "@vicons/tabler";
import Logo from "@/components/Logo.vue";

const personalNav = [
  {
    name: "account",
    icon: User,
    title: "账户信息",
  },
];
</script>

<style scoped lang="less">
.personal-container {
  width: calc(100vw - 80px);
  height: 100vh;
  top: 0;
  left: 80px;
}
</style>
