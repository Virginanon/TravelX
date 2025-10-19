import "./assets/main.css";
import "./assets/main.less";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// VUE AMAP
import VueAMap, { initAMapApiLoader } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";

// 初始化vue-amap
initAMapApiLoader({
  // 高德的key
  key: "6cfe24acbd0fb12030e20886626716da",
  securityJsCode: "452e90151be4273ff1313bf65c684964", // 新版key需要配合安全密钥使用
  //Loca:{
  //  version: '2.0.0'
  //} // 如果需要使用loca组件库，需要加载Loca
});

const app = createApp(App);

app.use(VueAMap);

app.use(router);

app.mount("#app");
