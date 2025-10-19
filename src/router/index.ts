import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "map",
            component: () => import("@/views/MapView.vue"),
        },
        {
            path: "/mall",
            name: "mall",
            component: () => import("@/views/MallView.vue"),
        },
        {
            path: "/route",
            name: "route",
            component: () => import("@/views/RouteView.vue"),
        },
        {
            path: "/user",
            name: "user",
            component: () => import("@/views/PersonalView/PersonalView.vue"),
            children: [
                {
                    path: "account",
                    name: "account",
                    component: () => import("@/views/PersonalView/Account/Account.vue"),
                },
            ],
        },
        {
            path: "/settings",
            name: "settings",
            component: () => import("@/views/SettingsView.vue"),
        },
        {
            path: "/mapOnly",
            name: "mapOnly",
            component: () => import("@/views/empty.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/LoginView.vue"),
        },
    ],
});

export default router;
