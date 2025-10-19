<script setup lang="ts">
import {
  NButton,
  useMessage,
  NIcon,
  NCard,
  NInput,
  NModal,
  NForm,
  NFormItem,
  NProgress,
  type FormRules,
  type FormInst,
} from "naive-ui";
import { KeyboardArrowRightRound } from "@vicons/material";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { post } from "@/global/gRequests";
import { RESET_PASSWORD } from "@/global/api/auth/personal";

const router = useRouter();
const message = useMessage();

// ===========================================================
// vip pregress

const vip = ref(56);
const vipLevel = computed(() => {
  const level = vip.value / 100;

  if (level < 0.2) {
    return "青铜";
  } else if (level < 0.5) {
    return "白银";
  } else if (level < 1) {
    return "黄金";
  }

  return "钻石";
});

// ===========================================================
// exit login

function handleExit() {
  localStorage.clear();
  router.push({ name: "login" });
}

// ===========================================================
// reset password

const currPassword = ref("placeholder"); // 账户目前的密码
const resetPasswordModal = ref(false);
const resetPasswordInfo = ref({
  email: "",
  newPassword: "",
  renterPassword: "",
});
const resetPasswordFormRef = ref<FormInst | null>(null);

const resetPasswordFormRule: FormRules = {
  email: {
    validator(rule, value: string) {
      return /^[a-zA-Z\d]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(value);
    },
    message: "邮箱格式不正确",
    trigger: ["input", "blur"],
  },
  newPassword: {
    validator(rule, value: string) {
      return /^(?=.*\d)(?=.*\d)[a-zA-Z\d]{8,20}$/.test(value);
    },
    message: "密码应同时包含至少一个字母和数字且位于8到20位之间",
    trigger: ["input", "blur"],
  },
  renterPassword: {
    validator(rule, value: string) {
      return resetPasswordInfo.value.newPassword === value;
    },
    trigger: ["blur"],
    message: "密码不一致",
  },
};

/**
 * 关闭重置密码模态框
 */
function handleCloseResetPasswordModal() {
  resetPasswordInfo.value = { email: "", newPassword: "", renterPassword: "" };
  resetPasswordModal.value = false;
}

/**
 * 异步重置密码
 */
async function handleResetPassword() {
  if (resetPasswordInfo.value.email === "" || resetPasswordInfo.value.newPassword === "") {
    message.warning("请填写值以继续");
    return;
  }

  try {
    // 验证表单
    await resetPasswordFormRef.value?.validate();
  } catch (err) {
    return;
  }

  try {
    const response: Auth.ResetPassword = await post(RESET_PASSWORD, {
      email: resetPasswordInfo.value.email,
      newPassword: resetPasswordInfo.value.newPassword,
    });

    message[response.success ? "info" : "warning"](response.message);
  } catch (err) {
    console.log(err);
    message.warning("网络错误");
  }
}
</script>

<template>
  <div class="account">
    <!-- 账户会员 -->
    <section
      class="account__vip text-white relative w-100 h-35 p-3 pb-8 rounded-xl bg-blue-400 dark:bg-gray-600 flex flex-col items-center"
    >
      <div
        class="absolute top-0 left-0 bg-gray-700 text-white font-bold p-1 pl-3 pr-3 rounded-tl-xl rounded-br-xl"
      >
        {{ vipLevel }}会员
      </div>
      <div class="vip__icon absolute w-15 h-8 top-0 right-0"></div>

      <div class="flex-1"></div>

      <div class="pb-3 w-full flex justify-between items-end">
        <p class="font-bold text-base"><span class="text-2xl">0</span>/2000</p>
        <p class="flex justify-center cursor-pointer">
          查看会员权益
          <n-icon style="width: 15px" :size="22" :component="KeyboardArrowRightRound" />
        </p>
      </div>

      <div class="w-full relative">
        <n-progress
          type="line"
          :show-indicator="false"
          color="#D0D3D4"
          rail-color="rgba(39, 55, 70, 0.3)"
          :percentage="vip"
          :height="5"
        ></n-progress>
        <div class="vip__stop-dot">
          <div class="stop-dot__label">青铜</div>
        </div>
        <div class="vip__stop-dot">
          <div class="stop-dot__label">白银</div>
        </div>
        <div class="vip__stop-dot">
          <div class="stop-dot__label">黄金</div>
        </div>
        <div class="vip__stop-dot">
          <div class="stop-dot__label">钻石</div>
        </div>
      </div>
    </section>

    <!-- 账户密码 -->
    <section class="account__password w-full mt-10">
      <h3 class="pb-3 text-lg border-b border-b-gray-700">账户密码</h3>

      <p class="pt-3 pb-3 text-sm">修改你的账户密码</p>
      <div class="w-100 flex gap-5">
        <n-input type="password" v-model:value="currPassword" disabled />
        <n-button @click="resetPasswordModal = true">重置密码</n-button>
      </div>

      <n-modal v-model:show="resetPasswordModal" :mask-closable="false">
        <n-card style="width: 400px">
          <n-form
            :model="resetPasswordInfo"
            :rules="resetPasswordFormRule"
            ref="resetPasswordFormRef"
            label-placement="left"
            label-align="right"
            label-width="60"
          >
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="resetPasswordInfo.email" placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item label="密码" path="newPassword">
              <n-input v-model:value="resetPasswordInfo.newPassword" placeholder="请输入密码" />
            </n-form-item>
            <n-form-item label="新密码" path="renterPassword">
              <n-input v-model:value="resetPasswordInfo.renterPassword" placeholder="请输入新密码" />
            </n-form-item>

            <div class="flex justify-between gap-5">
              <n-button class="flex-1" @click="handleCloseResetPasswordModal">取消</n-button>
              <n-button class="flex-1" @click="handleResetPassword">立即重置</n-button>
            </div>
          </n-form>
        </n-card>
      </n-modal>
    </section>

    <!-- 退出登录 -->
    <section class="mt-10 w-full">
      <NButton @click="handleExit" type="error" secondary>退出登录</NButton>
    </section>
  </div>
</template>

<style scoped lang="less">
// vip 盒子部分样式
.account__vip {
  .vip__stop-dot {
    position: absolute;
    top: -2px;

    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.5);

    &:nth-child(2) {
      left: 0;
    }
    &:nth-child(3) {
      left: 18%;
      .stop-dot__label {
        left: -10px;
      }
    }
    &:nth-child(4) {
      left: 48%;
      .stop-dot__label {
        left: -10px;
      }
    }
    &:nth-child(5) {
      left: 98%;
      .stop-dot__label {
        left: -20px;
      }
    }

    .stop-dot__label {
      position: absolute;
      top: 10px;
      width: 30px;
    }
  }
}
</style>
