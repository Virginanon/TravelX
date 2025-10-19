<template>
  <div
    class="route-container bg-white/80 dark:text-white dark:bg-gray-900/80 box-border p-10 flex flex-col rounded-2xl">
    <div class="text-4xl font-light text-blue-600 dark:text-blue-400">
      <Logo small-name="日程" horizontal-name />
    </div>
    <div class="w-full h-[90vh] flex">
      <div class="route-list-container flex flex-1 flex-col w-full mt-5 rounded-2xl overflow-hidden">
        <div v-for="(item, index) in routeData" :key="index"
          class="route-item bg-black/10 dark:bg-white/10 flex mb-5 box-border p-5 rounded-lg hover:bg-black/20 hover:dark:bg-white/20">
          <div class="flex-1 flex flex-col items-start justify-center">
            <n-icon :size="72">
              <component :is="typeIconEnum[item.type]" />
            </n-icon>
            <div class="route-name font-bold text-xl">{{ item.name }}</div>
            <div class="timediff font-thin text-xl">{{
              calculateTimeDiff(item.start_time, item.end_time) }}</div>
          </div>
          <div class="flex-2 shrink-0 flex flex-col items-center justify-center">
            <div class="flex w-full flex-col justify-between">
              <span class="flex w-full items-center justify-between p-2 bg-blue-600 text-white rounded-t-2xl pl-10 pr-10">
                <div class="shrink-0 mr-2 text-xl flex flex-col">
                  <span class="font-bold">开始</span>
                  <span class="text-lg">{{ item.from }}</span>
                </div>
                {{ item.start_time }}
              </span>
            </div>
            <div class="flex w-full flex-col justify-between ">
              <span class="flex w-full items-center justify-between p-2 bg-gray-600 text-white rounded-b-2xl pl-10 pr-10">
                <div class="shrink-0 mr-2 text-xl flex flex-col">
                  <span class="font-bold">结束</span>
                  <span class="text-lg">{{ item.to }}</span>
                </div>
                {{ item.end_time }}
              </span>
            </div>
          </div>

        <div class="flex-1 items-end justify-center flex flex-col">
          <span class="font-thin text-xl">距今还有</span>
          <span class="text-2xl font-bold">{{ getCountdown(item.start_time) }}</span>
        </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col mt-5 ml-2">
        <AMap class="rounded-2xl overflow-hidden flex-3" :dark-mode="darkMode" />
        <div class="w-full mt-5 bg-black/10 dark:bg-white/10 box-border p-5 rounded-lg hover:bg-black/20 hover:dark:bg-white/20 h-[200px]">
          <span class="text-2xl font-bold text-black/70 dark:text-white">沿途天气晴朗，祝您路途开心！</span>
          <div class="flex items-center justify-around w-full h-full text-black/70 dark:text-white">
            <div v-for="(item, index) in weatherData" :key="index" class="flex justify-center items-center">
              <n-icon :size="72"><component :is="weatherIconEnum[item.weather]" /></n-icon>
              <div class="flex flex-col ml-3">
                <span class="text-2xl font-bold">{{ item.city }}</span>
                <span class="text-md font-thin">{{ weatherNameEnum[item.weather] }} - {{ item.temperature }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import {
  LocalTaxiRound,
  AirplanemodeActiveRound,
  HotelRound,
  DirectionsBusRound,
  SubwayOutlined,
  TrainOutlined,
  WbSunnyRound,
  WbCloudyRound
} from '@vicons/material'
import { BuildingCarousel, Minimize } from '@vicons/tabler'
import { NIcon } from 'naive-ui';
import AMap from '@/components/AMap.vue';
import Logo from '@/components/Logo.vue';

const props = defineProps(['darkMode'])

interface classType {
  [key: string | number]: any
}

const typeIconEnum = ref<classType>({
  plane: shallowRef(AirplanemodeActiveRound),
  taxi: shallowRef(LocalTaxiRound),
  train: shallowRef(TrainOutlined),
  hotel: shallowRef(HotelRound),
  bus: shallowRef(DirectionsBusRound),
  metro: shallowRef(SubwayOutlined),
  sight: shallowRef(BuildingCarousel)
})

const weatherIconEnum = ref<classType>({
  sunny: shallowRef(WbSunnyRound),
  cloudy: shallowRef(WbCloudyRound)
})

const weatherNameEnum = ref<classType>({
  sunny: '晴',
  cloudy: '多云'
})

interface routeType {
  type: string,
  name: string,
  start_time: string,
  end_time: string,
  from: string,
  to: string,
  description: string
}

const routeData = ref<routeType[]>([
  {
    "type": "plane",
    "name": "CA1201",
    "start_time": "2025/05/01 08:30:00",
    "end_time": "2025/05/01 11:15:00",
    "from": "北京首都国际机场T3",
    "to": "西安咸阳国际机场T2",
    "description": "经济舱，含20kg托运行李"
  },
  {
    "type": "metro",
    "name": "西安地铁14号线",
    "start_time": "2025/05/01 11:40:00",
    "end_time": "2025/05/01 12:20:00",
    "from": "西安咸阳国际机场T3",
    "to": "西安北站",
    "description": "机场专线，票价7元"
  },
  {
    "type": "taxi",
    "name": "曹操出行",
    "start_time": "2025/05/01 12:30:00",
    "end_time": "2025/05/01 13:00:00",
    "from": "西安北站",
    "to": "西安威斯汀大酒店",
    "description": "商务车型"
  },
  {
    "type": "hotel",
    "name": "西安威斯汀大酒店",
    "start_time": "2025/05/01 14:00:00",
    "end_time": "2025/05/03 12:00:00",
    "from": "",
    "to": "",
    "description": "大雁塔景观房，含双早"
  },
  {
    "type": "bus",
    "name": "游5(306路)旅游专线",
    "start_time": "2025/05/02 07:30:00",
    "end_time": "2025/05/02 08:40:00",
    "from": "大雁塔北广场站",
    "to": "兵马俑站",
    "description": "首班车7:00，票价5元"
  },
  {
    "type": "sight",
    "name": "秦始皇兵马俑博物馆",
    "start_time": "2025/05/02 09:00:00",
    "end_time": "2025/05/02 12:30:00",
    "from": "",
    "to": "",
    "description": "1号坑+铜车马展厅，含讲解器"
  },
  {
    "type": "bus",
    "name": "机场大巴钟楼线",
    "start_time": "2025/05/03 13:30:00",
    "end_time": "2025/05/03 14:40:00",
    "from": "威斯汀酒店站",
    "to": "西安咸阳国际机场T3",
    "description": "每30分钟一班"
  },
  {
    "type": "train",
    "name": "G88",
    "start_time": "2025/05/03 15:30:00",
    "end_time": "2025/05/03 18:45:00",
    "from": "西安北站",
    "to": "成都东站",
    "description": "复兴号智能动车组，二等座"
  },
  {
    "type": "taxi",
    "name": "滴滴专车",
    "start_time": "2025/05/03 19:15:00",
    "end_time": "2025/05/03 19:45:00",
    "from": "成都东站",
    "to": "成都太古里亚朵酒店",
    "description": "新能源车型"
  },
  {
    "type": "sight",
    "name": "大熊猫繁育研究基地",
    "start_time": "2025/05/04 07:30:00",
    "end_time": "2025/05/04 11:00:00",
    "from": "",
    "to": "",
    "description": "观光车+太阳产房参观"
  }
])

const weatherData = ref([
  {
    city: '北京',
    weather: 'sunny',
    temperature: '22℃'
  },
  {
    city: '西安',
    weather: 'sunny',
    temperature: '24℃'
  },
  {
    city: '成都',
    weather: 'cloudy',
    temperature: '26℃'
  }
])

function calculateTimeDiff(startTime: string, endTime: string) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()

  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours} 小时 ${minutes} 分钟`
}

function getCountdown(targetTime: string) {
  const now = new Date()
  const target = new Date(targetTime)
  const diffMs = target.getTime() - now.getTime()

  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return `${days} 天 ${hours} 小时`
}
</script>

<style scoped lang="less">
.route-container {
  width: calc(100vw - 80px);
  height: 100vh;
  margin-left: 80px;
}

.route-list-container {
  overflow-y: scroll;
  max-height: 100%;
  scrollbar-color: rgb(150, 150, 150) transparent;
}

@media (max-width: 500px) {
  .route-container {
    width: 100vw;
    margin-left: 0;
    padding: 20px;
  }
}
</style>