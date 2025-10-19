<template>
    <div class="login-container fixed w-screen h-screen left-0 top-0">
        <img
            class="w-screen h-screen object-cover fixed left-0 top-0"
            :src="photoArr[rand]"
            alt="Background"
        />
        <div
            class="bg-white/70 dark:bg-black/70 text-black/80 dark:text-white/80 flex flex-col box-border justify-center p-10 fixed w-1/2 max-w-[600px] min-w-[400px] h-screen right-0 top-0 backdrop-blur-xl"
        >
            <div class="font-bold text-4xl mb-4 flex">
                <div class="bg-blue-300 pl-2 pr-2">
                    <Logo />
                </div>
                <span class="bg-blue-400 text-white p-2">智行派</span>
            </div>
            <div class="font-light text-3xl">
                {{ bRegisterForm ? "注册您的新账户" : "登录到您的账户" }}
            </div>
            <!-- login form -->
            <div v-if="!bRegisterForm" class="login-form flex flex-col w-full mt-5">
                <div class="text-xl font-bold flex items-center">
                    <n-icon><User /></n-icon>用户名
                </div>
                <NInput v-model:value="loginForm.username" class="mt-2" placeholder="请输入用户名" />
                <div class="text-xl font-bold flex items-center mt-5">
                    <n-icon><Lock /></n-icon>密码
                </div>
                <NInput
                    v-model:value="loginForm.password"
                    class="mt-2"
                    placeholder="请输入密码"
                    type="password"
                />
                <div class="mt-5">
                    还没有账号？
                    <span
                        @click="bRegisterForm = true"
                        class="text-blue-800 dark:text-blue-300 cursor-pointer hover:underline"
                    >
                        点击这里
                    </span>
                    注册账号
                </div>
                <div class="flex w-full mt-2">
                    <NButton @click="handleLoginClick" class="flex-1" type="info" size="large">
                        <div class="text-xl flex items-center font-bold">
                            登录
                            <n-icon><ChevronRight /></n-icon>
                        </div>
                    </NButton>
                </div>
            </div>
            <!-- register form -->
            <div v-else class="login-form flex flex-col w-full mt-5">
                <n-form ref="registerFormRef" :rules="registerFormRules" :model="registerForm">
                    <div class="text-xl font-bold flex items-center">
                        <n-icon><User /></n-icon>用户名
                    </div>
                    <n-form-item :theme-overrides="formItemThemeOverrides">
                        <NInput
                            v-model:value="registerForm.username"
                            class="mt-2"
                            placeholder="请输入用户名"
                        />
                    </n-form-item>

                    <div class="text-xl font-bold flex items-center">
                        <n-icon><EmailOutlined /></n-icon>邮箱
                    </div>
                    <n-form-item :theme-overrides="formItemThemeOverrides" path="email">
                        <NInput v-model:value="registerForm.email" class="mt-2" placeholder="请输入邮箱" />
                    </n-form-item>

                    <div class="text-xl font-bold flex items-center">
                        <n-icon><Lock /></n-icon>密码
                    </div>
                    <n-form-item :theme-overrides="formItemThemeOverrides" path="password">
                        <NInput
                            v-model:value="registerForm.password"
                            class="mt-2"
                            placeholder="请输入密码"
                            type="password"
                        />
                    </n-form-item>

                    <div class="text-xl font-bold flex items-center">
                        <n-icon><Lock /></n-icon>重复密码
                    </div>
                    <n-form-item :theme-overrides="formItemThemeOverrides" path="repeat_password">
                        <NInput
                            v-model:value="registerForm.repeat_password"
                            class="mt-2"
                            placeholder="请重复密码"
                            type="password"
                        />
                    </n-form-item>

                    <div class="">
                        已有账号？<span
                            @click="bRegisterForm = false"
                            class="text-blue-800 dark:text-blue-300 cursor-pointer hover:underline"
                            >点击这里</span
                        >
                        登录账号
                    </div>

                    <div class="flex w-full mt-2">
                        <NButton class="flex-1" type="info" size="large" @click="handleRegister">
                            <div class="text-xl flex items-center font-bold">
                                注册
                                <n-icon><ChevronRight /></n-icon>
                            </div>
                        </NButton>
                    </div>
                </n-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
    NInput,
    NIcon,
    NButton,
    useMessage,
    NForm,
    NFormItem,
    type FormRules,
    type FormItemProps,
    type FormInst,
} from "naive-ui";
import { EmailOutlined } from "@vicons/material";
import { User, Lock, ChevronRight } from "@vicons/tabler";
import { useRouter } from "vue-router";
import http from "@/global/gRequests";
import { LOGIN, REGISTER } from "@/global/api/auth/login";
import Logo from "@/components/Logo.vue";

import wall_1 from "@/assets/images/wall_1.jpg";
import wall_2 from "@/assets/images/wall_2.jpg";
import wall_3 from "@/assets/images/wall_3.jpg";
import wall_4 from "@/assets/images/wall_4.jpg";
import wall_5 from "@/assets/images/wall_5.jpg";

type FormItemThemeOverrides = NonNullable<FormItemProps["themeOverrides"]>;
const formItemThemeOverrides: FormItemThemeOverrides = {
    labelHeightMedium: "0",
};

const message = useMessage();
const router = useRouter();
const bRegisterForm = ref<boolean>(false);

const loginForm = ref({
    username: "",
    password: "",
});
const registerForm = ref({
    username: "",
    email: "",
    repeat_password: "",
    password: "",
});
const registerFormRef = ref<FormInst | null>(null);

/**
 * 注册表单验证规则
 */
const registerFormRules: FormRules = {
    email: {
        validator(rule, value: string) {
            return /^[a-zA-Z\d]+@[a-zA-Z]+(?:\.[a-zA-Z]+)+$/.test(value);
        },
        trigger: ["input", "blur"],
        message: "邮箱格式不正确",
    },
    password: {
        validator(rule, value: string) {
            return /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z\d]{8,20}$/.test(value);
        },
        trigger: ["input", "blur"],
        message: "密码应同时包含至少一个字母和数字且位于8到20位之间",
    },
    repeat_password: {
        validator(rule, value: string) {
            return registerForm.value.password === value;
        },
        trigger: ["blur"],
        message: "密码不一致",
    },
};

const rand = ref(Math.floor(Math.random() * 5));
const photoArr = ref<string[]>([wall_1, wall_2, wall_3, wall_4, wall_5]);

async function handleLoginClick() {
    if (loginForm.value.username == "" || loginForm.value.password == "") {
        message.warning("请填入所有值后继续");
        return;
    }

    // try {
    //     const response: Auth.Login = await http.post(LOGIN, loginForm.value);

    //     if (response.success) {
    //         localStorage.setItem("username", loginForm.value.username);
    //         localStorage.setItem("token", response.token!);
    //         router.push({ name: "map" });
    //     } else {
    //         message.warning(response.message);
    //     }
    // } catch (error) {
    //     console.log(error);
    //     message.warning("登陆失败");
    // }
    router.push({ name: "map" });
}

async function handleRegister() {
    if (
        registerForm.value.username === "" ||
        registerForm.value.repeat_password === "" ||
        registerForm.value.password === "" ||
        registerForm.value.email === ""
    ) {
        message.warning("请填入所有值后继续");
        return;
    }

    try {
        await registerFormRef.value?.validate();
    } catch (err) {
        console.log("表单验证失败");
        return;
    }

    try {
        const response: Auth.Register = await http.post(REGISTER, {
            username: registerForm.value.username,
            email: registerForm.value.email,
            password: registerForm.value.password,
        });

        if (response.success) {
            message.info(response.message);
            bRegisterForm.value = false;
        } else {
            message.warning(response.message);
        }
    } catch (err) {
        console.log(err);
        message.warning("注册失败");
    }
}
</script>

<style scoped lang="less">
@keyframes formEnter {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.login-form {
    animation: formEnter 0.4s;
}
</style>
