<template>
  <div
    class="mapview-container flex items-center justify-center bg-white/80 dark:text-white dark:bg-gray-900/80"
  >
    <div v-if="!bEnterMap" class="flow-border p-1">
      <PhotoWall class="bkg-wall" :images="photoArr" :columns="4" />
      <div
        class="delay-show-container box-border p-8 m-before flex flex-col items-center justify-center w-[65vw] max-w-[900px] min-w-[400px] bg-white dark:bg-gray-900 dark:text-white"
      >
        <div
          class="delay-show mb-5 w-26 h-26 flex items-center text-gray-400 justify-center rounded-full p-2"
        >
          <n-icon :size="72">
            <ChartBubble />
          </n-icon>
        </div>
        <div class="delay-show text-2xl font-thin mb-2 flex items-center">
          嘿！欢迎来到 <Logo />
        </div>
        <div class="delay-show text-3xl flex">
          来规划一个
          <div class="goodword font-bold text-red-800 dark:text-red-300">{{ goodWord }}</div>
          旅行计划吧
        </div>
        <n-input
          type="textarea"
          class="delay-show mt-5"
          placeholder="输入你的初步旅行计划，例如：我想去北京玩两天，重点参观历史文化古迹"
        ></n-input>
        <div class="delay-show w-full flex">
          <div
            @click="bShowModal = true"
            class="w-1/2 h-12 flex items-center justify-center text-xl mt-5 bg-gray-500 text-white dark:bg-gray-800 dark:text-white hover:bg-gray-600 cursor-pointer rounded-l-lg"
          >
            <n-icon :size="28">
              <Settings />
            </n-icon>
            自定义个人喜好
          </div>
          <div
            @click="handleNextStep"
            class="w-1/2 h-12 flex items-center justify-center text-xl mt-5 bg-blue-500 text-white dark:bg-blue-800 dark:text-white hover:bg-blue-600 cursor-pointer rounded-r-lg"
          >
            下一步
            <n-icon :size="28">
              <ArrowRight />
            </n-icon>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="m-left flex flex-col h-full">
        <div class="m-left-top flex items-center text-2xl font-bold bg-black/5 dark:bg-white/5">
          <n-icon @click="handleReturn" class="cursor-pointer">
            <ArrowLeft />
          </n-icon>
          <span class="ml-3">返回</span>
        </div>
        <div class="m-left-item flex-col bg-black/5 dark:bg-white/5">
          <span class="text-xl font-bold flex items-center"
            ><n-icon class="mr-1"> <AltRouteRound /> </n-icon>旅行路线</span
          >
          <div class="route-list-container flex items-center mt-2">
            <div
              v-for="(item, index) in plansTag"
              :key="index"
              @click="handleChangePlan(item)"
              :class="
                (item == currentPlan
                  ? 'route-tags-current p-2 bg-blue-600 text-white'
                  : 'route-tags p-2 bg-black/5 dark:bg-white/5') +
                ' mr-2 cursor-pointer rounded-md shrink-0'
              "
            >
              {{ item }}
            </div>
            <div class="flex-1"></div>
            <n-select
              class="max-w-30"
              @update:value="handleDateChange"
              :options="dataOptions"
              v-model:value="currentDate"
            ></n-select>
          </div>
          <div class="m-left-route-card-container mt-10 pb-10 flex flex-1 items-center">
            <div
              :style="getRandomStyle()"
              v-for="(item, index) in selectedDateData"
              :key="index"
              class="shrink-0 m-left-route-card rounded-lg relative h-40 w-40 ml-20 first:ml-0 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center"
            >
              <n-icon :size="64" class="opacity-20 mb-3">
                <BuildingFortress />
              </n-icon>
              <span class="font-bold text-lg">{{ item.location }}</span>
              <div class="route-card-icon flex flex-col justify-center items-center">
                <n-icon :size="32">
                  <ChevronRight />
                </n-icon>
                <span
                  class="rounded-full mt-2 p-1 pl-3 pr-3 bg-blue-600 text-white whitespace-nowrap font-bold"
                  >{{ item.travel_time }}分钟</span
                >
                <n-icon :size="32" class="opacity-20 mt-4">
                  <component :is="transportIconEnum[item.transport]" />
                </n-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="m-left-item flex flex-col flex-1 bg-black/5 dark:bg-white/5">
          <div class="text-xl font-bold flex items-center justify-between w-full">
            <span class="flex items-center"
              ><n-icon class="mr-1"> <QuestionAnswerRound /> </n-icon>问AI</span
            >
            <n-button tertiary round type="info">新建对话</n-button>
          </div>
          <div
            class="llm-msg-container flex flex-col w-full flex-1 overflow-y-scroll box-border mt-4"
          >
            <div
              v-for="(item, index) in chatList"
              :key="index"
              :class="msgContainerClassEnum[item.role]"
            >
              <div
                class="msg-sender h-14 w-14 p-2 flex items-center justify-center rounded-full text-white"
              >
                <n-icon :size="32">
                  <component :is="msgSenderIconEnum[item.role]" />
                </n-icon>
              </div>
              <div class="msg-content flex flex-col">
                <span class="msg-role font-bold">{{
                  item.role == "assistant" ? "旅游大模型" : "用户"
                }}</span>
                <div class="msg-message p-2 mt-2 bg-black/10 dark:bg-white/10">
                  <div v-html="item.html_message"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex mt-2 w-full justify-center items-center">
            <n-button circle type="info">
              <template #icon>
                <n-icon>
                  <Microphone />
                </n-icon>
              </template>
            </n-button>
            <n-input
              round
              class="mr-2 ml-2"
              placeholder="询问旅游大模型"
              v-model:value="inputText"
              @keydown.enter="handleChat"
            ></n-input>
            <n-button v-if="!generating" round type="info" @click="handleChat">发送</n-button>
            <n-button v-else round type="info">
              <template #icon>
                <n-icon :size="20">
                  <StopCircleFilled />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>
      <div class="m-right flex-1 h-full">
        <AMap :dark-mode="darkMode" />
      </div>
    </template>
    <n-modal v-model:show="bShowModal">
      <n-card
        style="width: 600px"
        title="编辑我的旅游偏好"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="preference-container w-[100%] p-[10px] bg-black/10 dark:bg-white/10 rounded-xl">
          <div class="interests p-[10px] border-b-[1px] border-b-gray-400">
            <h3 class="text-[16px] pb-[10px] font-bold">兴趣</h3>
            <n-checkbox-group v-model:value="preferences.interests">
              <n-checkbox
                v-for="(item, idx) in preferencesOptions.interests"
                :key="idx"
                size="large"
                :value="item.value"
                :label="item.label"
              />
            </n-checkbox-group>
          </div>

          <div class="travel-style p-[10px] border-b-[1px] border-b-gray-400">
            <h3 class="text-[16px] pb-[10px] font-bold">旅行风格</h3>
            <n-select
              :options="preferencesOptions.travelStyle"
              v-model:value="preferences.travelStyle"
            ></n-select>
          </div>

          <div class="accommodation p-[10px] border-b-[1px] border-b-gray-400">
            <h3 class="text-[16px] pb-[10px] font-bold">住宿选择</h3>

            <div class="preferred-type flex items-center pb-[10px]">
              <span class="w-[80px] text-[14px]">偏好类型</span>
              <n-select
                class="flex-1"
                :options="preferencesOptions.accommodation.preferredType"
                v-model:value="preferences.accommodation.preferredType"
              ></n-select>
            </div>

            <div class="price-range flex items-center pb-[10px]">
              <span class="w-[80px] text-[14px]">价格区间</span>
              <n-input-number
                class="flex-1"
                placeholder="最低价"
                :min="0"
                v-model:value="preferences.accommodation.priceRange.min"
              />
              <span class="w-[40px] text-[20px] flex justify-center">-</span>
              <n-input-number
                class="flex-1"
                placeholder="最高价"
                :min="0"
                v-model:value="preferences.accommodation.priceRange.max"
              />
            </div>

            <div class="amentities flex">
              <span class="text-[14px] w-[80px]">便利设施</span>
              <n-checkbox-group v-model:value="preferences.accommodation.amenities">
                <n-checkbox
                  v-for="(item, idx) in preferencesOptions.accommodation.amenities"
                  :key="idx"
                  size="large"
                  :value="item.value"
                  :label="item.label"
                />
              </n-checkbox-group>
            </div>
          </div>

          <div class="transportation p-[10px] border-b-[1px] border-b-gray-400">
            <h3 class="text-[16px] pb-[10px] font-bold">交通方式</h3>

            <div class="preferred-type flex pb-[10px]">
              <span class="text-[14px] w-[80px]">偏好类型</span>
              <n-checkbox-group v-model:value="preferences.transportation.preferredTypes">
                <n-checkbox
                  v-for="(item, idx) in preferencesOptions.transportation.preferredTypes"
                  :key="idx"
                  size="large"
                  :value="item.value"
                  :label="item.label"
                />
              </n-checkbox-group>
            </div>

            <div class="comfort-level flex items-center">
              <span class="text-[14px] w-[80px]">舒适等级</span>
              <n-select
                class="flex-1"
                v-model:value="preferences.transportation.comfortLevel"
                :options="preferencesOptions.transportation.comfortLevel"
              ></n-select>
            </div>
          </div>

          <div class="dietary p-[10px] border-b-[1px] border-b-gray-400">
            <h3 class="text-[16px] pb-[10px] font-bold">饮食</h3>

            <div class="preferences flex pb-[10px]">
              <span class="text-[14px] w-[80px]">饮食偏好</span>
              <n-checkbox-group v-model:value="preferences.dietary.preferences">
                <n-checkbox
                  v-for="(item, idx) in preferencesOptions.dietary.preferences"
                  :key="idx"
                  size="large"
                  :value="item.value"
                  :label="item.label"
                />
              </n-checkbox-group>
            </div>

            <div class="preferences flex">
              <span class="text-[14px] w-[80px]">口味选择</span>
              <n-checkbox-group class="flex-1" v-model:value="preferences.dietary.restrictions">
                <n-checkbox
                  v-for="(item, idx) in preferencesOptions.dietary.restrictions"
                  :key="idx"
                  size="large"
                  :value="item.value"
                  :label="item.label"
                />
              </n-checkbox-group>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex w-full justify-end">
            <n-button tertiary type="info" @click="bShowModal = false">取消</n-button>
            <n-button type="info" @click="bShowModal = false">确认</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from "vue";
import {
  ChartBubble,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  BuildingFortress,
  Atom,
  User,
  Microphone,
  Settings,
  X,
} from "@vicons/tabler";
import {
  AltRouteRound,
  QuestionAnswerRound,
  SubwayRound,
  DirectionsBusFilledRound,
  DirectionsWalkRound,
  StopCircleFilled,
} from "@vicons/material";
import {
  NIcon,
  NInput,
  NSelect,
  NButton,
  NModal,
  NCard,
  NCheckbox,
  NCheckboxGroup,
  NInputNumber,
} from "naive-ui";
import AMap from "@/components/AMap.vue";
import PhotoWall from "@/components/PhotoWall.vue";
import axios from "axios";
import Logo from "@/components/Logo.vue";

import wall_1 from "@/assets/images/wall_1.jpg";
import wall_2 from "@/assets/images/wall_2.jpg";
import wall_3 from "@/assets/images/wall_3.jpg";
import wall_4 from "@/assets/images/wall_4.jpg";
import wall_5 from "@/assets/images/wall_5.jpg";

const photoArr = ref<string[]>([wall_1, wall_2, wall_3, wall_4, wall_5]);
const props = defineProps(["darkMode"]);
const bEnterMap = ref<boolean>(false);
const bShowModal = ref<boolean>(false);

const goodWord = ref<string>("完美的");
const goodWordInterval = ref<NodeJS.Timeout>();

// ==============================================================
// chat

const msgSenderIconEnum = ref<classType>({
  assistant: shallowRef(Atom),
  user: shallowRef(User),
});

const msgContainerClassEnum = ref<classType>({
  assistant: "msg-container assistant-container",
  user: "msg-container user-container",
});

interface chatType {
  role: string;
  message: string;
  html_message: string;
}

interface AnswerType {
  answer: string;
  query: string;
}

const chatList = ref<chatType[]>([
  {
    role: "assistant",
    message: "您好，有什么可以帮助您的？",
    html_message: "您好，有什么可以帮助您的？",
  },
  // {
  //   role: "user",
  //   message: "您好，你能做什么？",
  //   html_message: "您好，你能做什么？",
  // },
]);

const inputText = ref("");
const generating = ref(false);

/**
 * 问答
 */
async function handleChat() {
  if (!inputText.value) return;

  chatList.value.push({
    role: "user",
    message: inputText.value,
    html_message: inputText.value,
  });
  generating.value = true;

  const query = inputText.value;
  inputText.value = "";

  try {
    const response = await axios({
      baseURL: "http://127.0.0.1:6006",
      url: "/ask",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query,
      },
    });
    const answer = (response.data as AnswerType).answer;
    chatList.value.push({
      role: "assistant",
      message: answer,
      html_message: answer,
    });
  } catch (error) {
    console.log("问答请求错误", error);
    chatList.value.push({
      role: "assistant",
      message: "网络错误",
      html_message: "网络错误",
    });
  } finally {
    generating.value = false;
  }
}

// =================================================================

interface classType {
  [key: string | number]: any;
}

const transportIconEnum = ref<classType>({
  步行: shallowRef(DirectionsWalkRound),
  地铁1号线: shallowRef(SubwayRound),
  公交: shallowRef(DirectionsBusFilledRound),
});

const listData = ref<any>({
  sights: [
    {
      name: "八一起义纪念馆",
      location: "江西省南昌市西湖区中山路380号",
      description: "纪念1927年南昌起义指挥部旧址，全国重点文物保护单位",
      type: "革命纪念",
      ticket_price: 0,
      latitude: 28.6782,
      longitude: 115.8844,
      opening_hours: "09:00–17:00",
      peak_hours: "10:00–12:00",
      recommended_duration: 2.0,
      tags: ["红色教育", "历史"],
    },
    {
      name: "滕王阁",
      location: "江西省南昌市东湖区滕王阁路58号",
      description: "江南三大名楼之一，始建于唐代，典型江南木构建筑",
      type: "文化古迹",
      ticket_price: 50,
      latitude: 28.6841,
      longitude: 115.8758,
      opening_hours: "08:00–18:00",
      peak_hours: "03–05月,09–11月",
      recommended_duration: 2.0,
      tags: ["文学", "建筑"],
    },
    {
      name: "南昌八一起义广场",
      location: "江西省南昌市西湖区八一大道与中山路交汇处",
      description: "大型广场，纪念南昌起义，夜景灯光秀",
      type: "历史文化",
      ticket_price: 0,
      latitude: 28.6843,
      longitude: 115.8902,
      opening_hours: "全天开放",
      peak_hours: "全年",
      recommended_duration: 1.0,
      tags: ["广场", "休闲"],
    },
    {
      name: "秋水广场",
      location: "江西省南昌市红谷滩新区洪城路与象山路交汇处",
      description: "世界最大音乐喷泉广场，可夜游观光",
      type: "城市景观",
      ticket_price: 0,
      latitude: 28.6895,
      longitude: 115.8571,
      opening_hours: "全天开放",
      peak_hours: "04–10月",
      recommended_duration: 1.5,
      tags: ["音乐喷泉", "休闲"],
    },
    {
      name: "江西省博物馆",
      location: "江西省南昌市红谷滩新区赣江中大道351号",
      description: "集历史文物与现代展览于一体的综合性博物馆",
      type: "文化展览",
      ticket_price: 0,
      latitude: 28.6935,
      longitude: 115.8729,
      opening_hours: "09:00–17:00（周一闭馆）",
      peak_hours: "全年",
      recommended_duration: 2.0,
      tags: ["博物馆", "展览"],
    },
    {
      name: "佑民寺",
      location: "江西省南昌市西湖区府后街12号",
      description: "始建于南唐，海拔最高点可俯瞰赣江全景",
      type: "宗教建筑",
      ticket_price: 0,
      latitude: 28.685,
      longitude: 115.888,
      opening_hours: "08:00–17:00",
      peak_hours: "04–10月",
      recommended_duration: 1.5,
      tags: ["寺庙", "摄影"],
    },
    {
      name: "豫章书院",
      location: "江西省南昌市南昌县玉山村",
      description: "江西首府旧址及书院遗址",
      type: "历史遗迹",
      ticket_price: 20,
      latitude: 28.669,
      longitude: 115.912,
      opening_hours: "09:00–17:00",
      peak_hours: "03–05月,09–11月",
      recommended_duration: 1.5,
      tags: ["书院", "文化"],
    },
    {
      name: "瑶湖国家湿地公园",
      location: "江西省南昌市红谷滩新区瑶湖北大道",
      description: "城市湿地公园，自然风光与亲水游玩结合",
      type: "自然公园",
      ticket_price: 10,
      latitude: 28.752,
      longitude: 115.825,
      opening_hours: "07:00–18:00",
      peak_hours: "04–09月",
      recommended_duration: 2.0,
      tags: ["自然", "亲水"],
    },
    {
      name: "南昌汉代帅府遗址",
      location: "江西省南昌市红谷滩新区赣江中大道351号（博物馆旁）",
      description: "汉代古建筑遗址复原，兼具考古价值",
      type: "历史古迹",
      ticket_price: 0,
      latitude: 28.6938,
      longitude: 115.8725,
      opening_hours: "09:00–17:00",
      peak_hours: "全年",
      recommended_duration: 1.5,
      tags: ["考古", "文物"],
    },
    {
      name: "滕王阁音乐广场",
      location: "江西省南昌市东湖区滕王阁路与八一大道交口",
      description: "滕王阁景区外广场，定期有民俗表演",
      type: "城市文化",
      ticket_price: 0,
      latitude: 28.6843,
      longitude: 115.8759,
      opening_hours: "09:00–21:00",
      peak_hours: "04–10月",
      recommended_duration: 1.0,
      tags: ["表演", "打卡"],
    },
  ],
  hotel: {
    name: "如家快捷酒店（八一广场地铁站店）",
    location: "江西省南昌市东湖区八一大道258号",
    description: "连锁经济型酒店，距八一广场地铁站步行3分钟，周边餐饮丰富",
    star_rating: 2,
    room_types: ["标准双床房", "大床房"],
    facilities: ["免费Wi-Fi", "24h热水", "行李寄存"],
    check_in_time: "14:00",
    check_out_time: "12:00",
    latitude: 28.6843,
    longitude: 115.8902,
    phone: "0791-88888888",
    address: "江西省南昌市东湖区八一大道258号",
  },
  plans: {
    普通版: {
      第1天: [
        {
          order: 1,
          from: "酒店",
          to: "八一起义纪念馆",
          transport: "步行",
          travel_time: 10,
          play_time: 2.0,
        },
        {
          order: 2,
          from: "八一起义纪念馆",
          to: "南昌八一起义广场",
          transport: "步行",
          travel_time: 5,
          play_time: 1.0,
        },
        {
          order: 3,
          from: "南昌八一起义广场",
          to: "滕王阁",
          transport: "地铁1号线",
          travel_time: 15,
          play_time: 2.0,
        },
        {
          order: 4,
          from: "滕王阁",
          to: "滕王阁音乐广场",
          transport: "步行",
          travel_time: 5,
          play_time: 1.0,
        },
        {
          order: 5,
          from: "滕王阁音乐广场",
          to: "江西省博物馆",
          transport: "地铁1号线",
          travel_time: 20,
          play_time: 2.0,
        },
        {
          order: 6,
          from: "江西省博物馆",
          to: "酒店",
          transport: "地铁1号线",
          travel_time: 25,
          play_time: 0,
        },
      ],
      第2天: [
        {
          order: 1,
          from: "酒店",
          to: "豫章书院",
          transport: "公交",
          travel_time: 20,
          play_time: 1.5,
        },
        {
          order: 2,
          from: "豫章书院",
          to: "南昌汉代帅府遗址",
          transport: "步行",
          travel_time: 10,
          play_time: 1.5,
        },
        {
          order: 3,
          from: "南昌汉代帅府遗址",
          to: "瑶湖国家湿地公园",
          transport: "公交",
          travel_time: 25,
          play_time: 2.0,
        },
        {
          order: 4,
          from: "瑶湖国家湿地公园",
          to: "佑民寺",
          transport: "公交",
          travel_time: 30,
          play_time: 1.5,
        },
        {
          order: 5,
          from: "佑民寺",
          to: "秋水广场",
          transport: "步行",
          travel_time: 15,
          play_time: 1.5,
        },
        {
          order: 6,
          from: "秋水广场",
          to: "酒店",
          transport: "公交",
          travel_time: 25,
          play_time: 0,
        },
      ],
    },
    特种兵版: {
      第1天: [
        {
          order: 1,
          from: "酒店",
          to: "八一起义纪念馆",
          transport: "步行",
          travel_time: 10,
          play_time: 2.0,
        },
        {
          order: 2,
          from: "八一起义纪念馆",
          to: "南昌八一起义广场",
          transport: "步行",
          travel_time: 5,
          play_time: 1.0,
        },
        {
          order: 3,
          from: "南昌八一起义广场",
          to: "滕王阁",
          transport: "地铁1号线",
          travel_time: 15,
          play_time: 2.0,
        },
        {
          order: 4,
          from: "滕王阁",
          to: "滕王阁音乐广场",
          transport: "步行",
          travel_time: 5,
          play_time: 1.0,
        },
        {
          order: 5,
          from: "滕王阁音乐广场",
          to: "江西省博物馆",
          transport: "地铁1号线",
          travel_time: 20,
          play_time: 2.0,
        },
        {
          order: 6,
          from: "江西省博物馆",
          to: "豫章书院",
          transport: "公交",
          travel_time: 20,
          play_time: 1.5,
        },
        {
          order: 7,
          from: "豫章书院",
          to: "南昌汉代帅府遗址",
          transport: "步行",
          travel_time: 10,
          play_time: 1.5,
        },
        {
          order: 8,
          from: "南昌汉代帅府遗址",
          to: "佑民寺",
          transport: "公交",
          travel_time: 25,
          play_time: 1.5,
        },
        {
          order: 9,
          from: "佑民寺",
          to: "秋水广场",
          transport: "步行",
          travel_time: 15,
          play_time: 1.0,
        },
        {
          order: 10,
          from: "秋水广场",
          to: "瑶湖国家湿地公园",
          transport: "公交",
          travel_time: 30,
          play_time: 2.0,
        },
        {
          order: 11,
          from: "瑶湖国家湿地公园",
          to: "酒店",
          transport: "公交",
          travel_time: 35,
          play_time: 0,
        },
      ],
      第2天: [
        {
          order: 1,
          from: "酒店",
          to: "豫章书院",
          transport: "公交",
          travel_time: 20,
          play_time: 1.5,
        },
        {
          order: 2,
          from: "豫章书院",
          to: "滕王阁音乐广场",
          transport: "步行",
          travel_time: 15,
          play_time: 1.0,
        },
        {
          order: 3,
          from: "滕王阁音乐广场",
          to: "八一起义纪念馆",
          transport: "公交",
          travel_time: 25,
          play_time: 2.0,
        },
        {
          order: 4,
          from: "八一起义纪念馆",
          to: "滕王阁",
          transport: "地铁1号线",
          travel_time: 15,
          play_time: 2.0,
        },
        {
          order: 5,
          from: "滕王阁",
          to: "江西省博物馆",
          transport: "地铁1号线",
          travel_time: 20,
          play_time: 2.0,
        },
        {
          order: 6,
          from: "江西省博物馆",
          to: "酒店",
          transport: "地铁1号线",
          travel_time: 25,
          play_time: 0,
        },
      ],
    },
  },
});

const plansTag = ref<string[]>([]);
const currentPlan = ref<string>("");
const dataOptions = ref<any[]>([]);
const currentDate = ref<string>("");
const selectedDateData = ref<any>([]);

function getRandomStyle() {
  return {
    "--delay": `${Math.random() * 1}s`, // 0~2秒随机延迟
    "--duration": `${0.5 + Math.random() * 1.5}s`, // 0.5~2秒随机持续时间
  };
}

function handleNextStep() {
  bEnterMap.value = true;
}

function handleReturn() {
  bEnterMap.value = false;
  goodWordPlay();
}

function initData() {
  plansTag.value = Object.keys(listData.value.plans);
  currentPlan.value = plansTag.value[0];
  handleChangePlan(currentPlan.value);
}

function handleChangePlan(click_item: string) {
  currentPlan.value = click_item;
  dataOptions.value = [];
  Object.keys(listData.value.plans[currentPlan.value]).forEach(item => {
    dataOptions.value.push({
      label: item,
      value: item,
    });
  });
  currentDate.value = Object.keys(listData.value.plans[currentPlan.value])[0];
  selectedDateData.value = [];
  listData.value.plans[currentPlan.value][currentDate.value].forEach(
    (value: any, index: number) => {
      if (index == 0) {
        selectedDateData.value.push({
          location: value.from,
          transport: "",
          travel_time: "",
          play_time: 0,
        });
      }
      selectedDateData.value.push({
        location: value.to,
        transport: value.transport,
        travel_time: value.travel_time,
        play_time: value.play_time,
      });
    }
  );
}

function handleDateChange(value: string) {
  selectedDateData.value = [];
  listData.value.plans[currentPlan.value][value].forEach((value: any, index: number) => {
    if (index == 0) {
      selectedDateData.value.push({
        location: value.from,
        transport: "",
        travel_time: "",
        play_time: 0,
      });
    }
    selectedDateData.value.push({
      location: value.to,
      transport: value.transport,
      travel_time: value.travel_time,
      play_time: value.play_time,
    });
  });
}

function goodWordPlay() {
  goodWordInterval.value = setInterval(() => {
    if (bEnterMap.value) {
      if (goodWordInterval.value) {
        clearInterval(goodWordInterval.value);
      }
    }
    goodWord.value = ["精妙的", "美好的", "实惠的", "妥善的", "安全的", "自由的", "完美的"][
      Math.floor(Math.random() * 7)
    ];
  }, 1000);
}

// DIY Modal Function & Vars
interface preferences {
  dietary: {
    preferences: string[];
    restrictions: string[];
  };
  interests: string[];
  travelStyle: string;
  accommodation: {
    amenities: string[];
    priceRange: {
      min: number;
      max: number;
    };
    preferredType: string;
  };
  transportation: {
    comfortLevel: string;
    preferredTypes: string[];
  };
}

const preferencesOptions = ref({
  interests: [
    {
      label: "文化",
      value: "文化",
    },
    {
      label: "历史",
      value: "历史",
    },
    {
      label: "美食",
      value: "美食",
    },
    {
      label: "摄影",
      value: "摄影",
    },
  ],
  travelStyle: [
    {
      label: "自由行",
      value: "自由行",
    },
    {
      label: "跟团游",
      value: "跟团游",
    },
    {
      label: "探险旅游",
      value: "探险旅游",
    },
    {
      label: "文化旅游",
      value: "文化旅游",
    },
    {
      label: "静态旅游",
      value: "静态旅游",
    },
    {
      label: "民俗旅游",
      value: "民俗旅游",
    },
  ],
  accommodation: {
    preferredType: [
      {
        label: "酒店",
        value: "hotel",
      },
      {
        label: "旅馆",
        value: "inn",
      },
      {
        label: "民宿",
        value: "homestay",
      },
      {
        label: "露营",
        value: "camping",
      },
    ],
    amenities: [
      {
        label: "wifi",
        value: "wifi",
      },
      {
        label: "早餐",
        value: "breakfast",
      },
      {
        label: "停车场",
        value: "parking",
      },
    ],
  },
  transportation: {
    preferredTypes: [
      {
        label: "火车",
        value: "train",
      },
      {
        label: "公交车",
        value: "bus",
      },
    ],
    comfortLevel: [
      {
        label: "较高",
        value: "superior",
      },
      {
        label: "标准",
        value: "standard",
      },
      {
        label: "较低",
        value: "lower",
      },
    ],
  },
  dietary: {
    preferences: [
      {
        label: "中餐",
        value: "中餐",
      },
      {
        label: "西餐",
        value: "西餐",
      },
      {
        label: "韩餐",
        value: "韩餐",
      },
      {
        label: "其它",
        value: "其它",
      },
    ],
    restrictions: [
      {
        label: "清淡",
        value: "清淡",
      },
      {
        label: "偏咸",
        value: "偏咸",
      },
      {
        label: "偏甜",
        value: "偏甜",
      },
      {
        label: "微辣",
        value: "微辣",
      },
      {
        label: "中辣",
        value: "中辣",
      },
      {
        label: "特辣",
        value: "特辣",
      },
    ],
  },
});

const preferences = ref<preferences>({
  dietary: {
    preferences: ["中餐", "西餐"],
    restrictions: ["清淡"],
  },
  interests: ["文化", "历史", "美食", "摄影"],
  travelStyle: "自由行",
  accommodation: {
    amenities: ["wifi", "breakfast", "parking"],
    priceRange: {
      max: 500,
      min: 200,
    },
    preferredType: "hotel",
  },
  transportation: {
    comfortLevel: "standard",
    preferredTypes: ["train", "bus"],
  },
});

onMounted(() => {
  initData();
  goodWordPlay();
});
</script>

<style scoped lang="less">
.mapview-container {
  width: calc(100vw - 80px);
  margin-left: 80px;
  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
}

.m-before {
  border-radius: 20px;
}

@keyframes rotateGradient {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.flow-border {
  animation: rotateGradient 5s infinite;
  border-radius: 22px;
  background: repeating-conic-gradient(
    rgb(80, 80, 80),
    transparent,
    rgb(80, 80, 80),
    transparent,
    rgb(80, 80, 80)
  );
  background-size: 400%;
  background-repeat: no-repeat;
}

.dark .flow-border {
  background: repeating-conic-gradient(white, transparent, white, transparent, white);
  background-size: 400%;
}

@keyframes opIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.bkg-wall {
  animation: opIn 0.4s 1s both;
  position: fixed;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
}

.m-left {
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  animation: opIn 0.4s both;
  margin-right: 20px;
  max-width: 50vw;
}

.m-left-item {
  border-radius: 20px;
  transition-duration: 0.4s;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
}

.m-left-item:last-child {
  margin-top: 20px;
}

.m-left-route-card {
  opacity: 0;
  animation: fadeIn var(--duration) ease var(--delay) forwards;
}

.route-card-icon {
  position: absolute;
  width: 50px;
  left: -65px;
  top: 50%;
  transform: translateY(-50%);
}

.m-left-route-card:first-child {
  .route-card-icon {
    display: none;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes goodwordAnim {
  0% {
    transform: scale(1);
  }

  3% {
    transform: scale(1);
  }

  6% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.goodword {
  animation: goodwordAnim 1s infinite;
  margin: 0 10px;
}

.m-left-top {
  margin-bottom: 20px;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
}

.m-right {
  overflow: hidden;
  border-radius: 20px;
  animation: opIn 0.4s 1s both;
}

.m-left-route-card-container {
  max-width: 100%;
  overflow-x: scroll;
  scrollbar-color: rgb(150, 150, 150) transparent;
}

.llm-msg-container {
  scrollbar-color: rgb(150, 150, 150) transparent;
}

.msg-container {
  display: flex;
  margin-top: 10px;
}

@keyframes llmBkgAnim {
  0% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0 0;
  }
}

.assistant-container {
  .msg-sender {
    animation: llmBkgAnim 3s infinite linear;
    background: linear-gradient(45deg, rgb(237, 76, 73), rgb(58, 51, 240));
    background-size: 200%;
    margin-right: 10px;
  }

  .msg-message {
    border-radius: 0 10px 10px 10px;
  }
}

.user-container {
  flex-direction: row-reverse;

  .msg-sender {
    background-color: rgb(73, 73, 90);
    margin-left: 10px;
  }

  .msg-content {
    align-items: end;
  }

  .msg-message {
    border-radius: 10px 0 10px 10px;
  }
}

@media (max-width: 768px) {
  .mapview-container {
    width: 100vw;
    margin-left: 0;
  }
}
</style>
