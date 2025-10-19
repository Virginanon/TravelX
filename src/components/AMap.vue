<template>
  <div class="map-container">
    <el-amap 
      v-model:zoom="mapConfig.zoom" 
      v-model:center="mapConfig.center" 
      @init="initMap" 
      :map-style="darkMode ? 'amap://styles/grey' : 'amap://styles/whitesmoke'"
      :dragEnable="true" 
    >
      <el-amap-control-scale :offset="[100, 20]" position="RT" :visible="true" />
    </el-amap>
    <!-- MAP CONTROLS -->
    <div class="map-controls-container flex p-2 pl-3 pr-3 fixed right-5 bottom-5 z-30 rounded-4xl bg-white/50 dark:bg-blue-950/50 dark:text-white">
      <div class="text-center flex items-center justify-center">
        <span class="font-thin flex items-center justify-center"><n-icon size="16"><ZoomIn /></n-icon>缩放倍率：</span>
        <span class="text-blue-600 dark:text-blue-400 font-bold">{{ calcScale().toFixed(1) }}</span>x
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElAmap, useGeolocation ,lazyAMapApiLoaderInstance, ElAmapControlScale } from "@vuemap/vue-amap";
import { NIcon } from 'naive-ui';
import { ZoomIn } from '@vicons/tabler';

let map = null

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

const mapConfig = ref<mapConfigType>({
  zoom: 15,
  center: [116.397026, 39.916351]
})

function initMap(e : Event) {
  map = e
}

function calcScale() {
  const minZoom = 2
  const maxZoom = 20
  const baselineZoom = 15
  const clampedZoom = Math.min(Math.max(mapConfig.value.zoom, minZoom), maxZoom)
  if (clampedZoom <= baselineZoom) {
    return (clampedZoom - minZoom) / (baselineZoom - minZoom);
  } else {
    return (clampedZoom - baselineZoom) / (maxZoom - baselineZoom) + 1;
  }
}

async function initPage() {
  await lazyAMapApiLoaderInstance.then(() => {
    useGeolocation({
      enableHighAccuracy: true,
      needAddress: true
    }).then(res => {
      const {getCurrentPosition, getCityInfo} = res;
      getCurrentPosition().then(currentPosition => {
        mapConfig.value.center = currentPosition.position.toArray();
        console.log('currentPosition: ', currentPosition)
      });
      // getCityInfo().then(cityResult => {
      //   console.log('cityResult: ', cityResult)
      // })
    })
  })
}
</script>

<style scoped lang="less">
.map-container {
  width: 100%;
  height: 100%;
}
</style>