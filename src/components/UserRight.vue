<template>
  <div>
    <!-- USER ICON RIGHT -->
    <div class="user-right-login-container p-3 fixed right-5 top-5 flex justify-center items-center rounded-4xl bg-blue-600 text-white cursor-pointer hover:bg-blue-800">
      <n-icon size="24"><UserCircle /></n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui';
import { UserCircle } from '@vicons/tabler';
</script>

<style scoped lang="less">

</style>