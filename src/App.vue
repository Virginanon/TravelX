<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import { RouterView } from "vue-router";
import {
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
    type GlobalThemeOverrides,
    darkTheme,
    lightTheme,
} from "naive-ui";
import LeftBar from "./components/LeftBar.vue";
import AMap from "./components/AMap.vue";
import UserRight from "./components/UserRight.vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();

const bDarkMode = ref<boolean>(localStorage.getItem("darkmode") === "true" ? true : false);

interface userData {
    username: string;
    token: string;
}

const user = ref<userData>({
    username: "",
    token: "",
});

interface classType {
    [key: string | number]: any;
}

const bDarkModeClassEnum = ref<classType>({
    0: "",
    1: "dark",
});

const themeOverrides: GlobalThemeOverrides = {
    common: {
        // Override Theme,
        primaryColor: "#155DFC",
        hoverColor: "#dbeafe",
        actionColor: "#1C398E",
    },
    Input: {
        borderHover: "1px solid #1C398E",
        borderFocus: "1px solid #155DFC",
    },
};

function handleSwitchDarkMode() {
    bDarkMode.value = !bDarkMode.value;
    localStorage.setItem("darkmode", bDarkMode.value ? "true" : "false");
}

function handleEnterPage(page: string) {
    if (page === route.name) {
        // router.push({ name: "mapOnly" });
        return;
    }
    router.push({ name: page });
}

// 用户登录相关
function initUser() {
    if (!localStorage.getItem("token")) {
        user.value = {
            username: "",
            token: "",
        };
        if (route.name != "login") router.push({ name: "login" });
        console.log("No Login User");
        return;
    }
    user.value = {
        username: localStorage.getItem("username")!,
        token: localStorage.getItem("token")!,
    };
    console.log("User Log");
}

onMounted(() => {
    initUser();
});
</script>

<template>
    <div :class="bDarkModeClassEnum[bDarkMode ? 1 : 0]">
        <NConfigProvider
            class="view-container"
            :theme-overrides="themeOverrides"
            :theme="bDarkMode ? darkTheme : lightTheme"
        >
            <NMessageProvider>
                <NDialogProvider>
                    <LeftBar
                        @switch-dark-mode="handleSwitchDarkMode"
                        :dark-mode="bDarkMode"
                        @enter-page="handleEnterPage"
                    />
                    <!-- <UserRight /> -->
                    <router-view v-slot="{ Component }">
                        <transition name="slide-fade" mode="out-in">
                            <keep-alive>
                                <component :dark-mode="bDarkMode" :is="Component" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </NDialogProvider>
            </NMessageProvider>
        </NConfigProvider>
    </div>
</template>

<style scoped lang="less">
@bezier-in: cubic-bezier(0.25, 0.1, 0.25, 1);
@bezier-out: cubic-bezier(0.25, 0.1, 0.25, 1);
@time-enter: 0.3s;
@time-leave: 0.3s;

.slide-fade-enter-active {
    transition: all @time-enter @bezier-in;
}

.slide-fade-leave-active {
    transition: all @time-leave @bezier-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}

@media (max-width: 520px) {
    .slide-fade-enter-from {
        transform: translateY(-100%);
    }

    .slide-fade-leave-to {
        transform: translateY(-100%);
        opacity: 0;
    }
}
</style>
