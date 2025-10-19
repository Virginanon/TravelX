<template>
  <div class="mall-container bg-white dark:text-white dark:bg-gray-900 flex flex-col">
    <!-- logo -->
    <div class="text-4xl font-light text-blue-600 dark:text-blue-400">
      <Logo small-name="商场" horizontal-name />
    </div>

    <!-- products -->
    <div class="mall-content w-full h-full flex flex-col mt-5">
      <!-- hot products list -->
      <div class="text-2xl flex items-center font-bold">
        <n-icon class="mr-2"><Flame /></n-icon>时下热销商品 <n-icon><ChevronRight /></n-icon>
      </div>
      <div class="w-full relative mt-5 box-border">
        <div class="hot-item-list flex items-center h-full w-full pb-4">
          <div
            v-for="item in hotItemsList"
            :key="item.id"
            class="hot-item rounded-2xl overflow-hidden flex flex-col w-75 shrink-0 mr-2.5 bg-black/10 dark:bg-white/10 hover:bg-black/20 hover:dark:bg-white/20"
            @click="() => handleOpenModal(item)"
          >
            <div class="h-45 w-full overflow-hidden">
              <img class="w-full h-full object-cover" :src="item.image" alt="item-image" />
            </div>
            <div class="h-35 box-border flex flex-col p-2.5 w-full">
              <div class="hot-item-name font-bold text-xl">{{ item.name }}</div>
              <div class="hot-item-name font-light text-sm flex-1">{{ item.description }}</div>
              <div class="hot-item-name font-bold mt-2 text-2xl">￥{{ item.price }}</div>
            </div>
          </div>
        </div>
        <div class="hot-items-cover h-80 w-full absolute top-0 left-0 z-10"></div>
      </div>

      <!-- products list -->
      <div class="text-2xl flex items-center font-bold mt-10">
        <n-icon class="mr-2"><Components /></n-icon>商品列表<n-icon><ChevronRight /></n-icon>
      </div>
      <div class="items-container mt-5 normal-items-container grid gap-2.5">
        <div
          v-for="item in normalItemsList"
          :key="item.id"
          class="item-container rounded-2xl relative overflow-hidden w-full h-40 shrink-0 cursor-pointer"
          @click="() => handleOpenModal(item)"
        >
          <img class="w-full h-full object-cover" :src="item.image" alt="normal-image" />
          <div
            class="item-info-container backdrop-blur-xl bg-white/70 dark:bg-black/40 absolute w-full h-full bottom-[-100%] left-0 z-10"
          >
            <div class="font-bold text-sm">{{ item.name }}</div>
            <div class="font-light">￥{{ item.price }}</div>
          </div>
        </div>

        <div
          class="item-container rounded-2xl relative overflow-hidden w-full h-40 shrink-0 cursor-pointer flex items-center justify-center bg-black/10 dark:bg-white/10 hover:bg-black/20 hover:dark:bg-white/20"
        >
          <div class="font-bold text-xl flex items-center">
            查看更多<n-icon><ChevronRight /></n-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 购物车图标 -->
    <div
      class="shopping-cart-icon w-16 h-16 rounded-full flex justify-center items-center fixed z-999 right-25 bottom-10 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 hover:dark:bg-gray-700 cursor-pointer"
      @click="openShoppingCart = true"
    >
      <n-icon :size="35" :component="ShoppingCartOutlined" />
    </div>

    <!-- 购物车边栏 -->
    <div
      class="shopping-cart flex flex-col gap-5 p-5 fixed right-[-500px] top-0 z-999 w-[500px] h-[100vh] bg-gray-100 dark:bg-gray-800"
      :class="openShoppingCart ? 'shopping-cart--open' : ''"
    >
      <div
        class="w-12 h-12 transition duration-150 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 hover:dark:bg-gray-700 cursor-pointer"
        @click="openShoppingCart = false"
      >
        <n-icon :component="CloseRound" :size="35" />
      </div>

      <div v-if="shoppingCart.length === 0" class="h-[60vh]">
        <n-empty description="还没有商品，请挑选一些吧"></n-empty>
      </div>
      <div v-else class="shopping-cart__items h-[65vh] flex flex-col gap-2.5">
        <div v-for="(item, index) in shoppingCart" :key="item.product.id" class="flex gap-5">
          <img :src="item.product.image" :alt="item.product.name" width="100" height="100" />
          <div class="flex-1 flex flex-col justify-between">
            <h3 class="text-lg">{{ item.product.name }}</h3>
            <div class="flex justify-between items-center">
              <span class="text-base">
                ￥
                {{
                  (
                    shoppingCart[index].count * parseFloat(shoppingCart[index].product.price)
                  ).toFixed(2)
                }}
              </span>

              <n-input-number
                button-placement="both"
                :min="0"
                v-model:value="shoppingCart[index].count"
                @update:value="value => (value === 0 ? removeFromShoppingCart(index) : '')"
                style="width: 30%"
              >
                <template #minus-icon>
                  <n-icon :component="DoDisturbOnOutlined" />
                </template>
                <template #add-icon>
                  <n-icon :component="AddCircleOutlineFilled" />
                </template>
              </n-input-number>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1"></div>

      <div class="flex justify-end text-lg">总计：￥{{ calcTotalPrice() }}</div>

      <div class="flex gap-5">
        <n-button class="flex-1" @click="shoppingCart = []">清空购物车</n-button>
        <n-button class="flex-1">去结算</n-button>
      </div>
    </div>

    <n-modal v-model:show="productDetailModal" @close="selectedProduct = null">
      <n-card style="width: fit-content">
        <div class="product-detail w-2xl flex gap-5">
          <img
            :src="selectedProduct!.product.image"
            :alt="selectedProduct!.product.name"
            width="300"
            height="300"
            class="flex-1"
          />
          <div class="flex-1 flex flex-col gap-5">
            <h3 class="text-2xl">{{ selectedProduct!.product.name }}</h3>
            <p class="text-base">{{ selectedProduct!.product.description }}</p>
            <div class="flex justify-between">
              <span class="text-xl">
                ￥{{
                  (selectedProduct!.count * parseFloat(selectedProduct!.product.price)).toFixed(2)
                }}
              </span>

              <n-input-number
                button-placement="both"
                :min="1"
                v-model:value="selectedProduct!.count"
                style="width: 30%"
              >
                <template #minus-icon>
                  <n-icon :component="DoDisturbOnOutlined" />
                </template>
                <template #add-icon>
                  <n-icon :component="AddCircleOutlineFilled" />
                </template>
              </n-input-number>
            </div>

            <div class="flex-1"></div>

            <div class="flex gap-2.5">
              <n-button class="flex-1" @click="addToShoppingCart">加入购物车</n-button>
              <n-button class="flex-1">立即购买</n-button>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/components/Logo.vue";
import { NIcon, NButton, NModal, NCard, NInputNumber, NEmpty } from "naive-ui";
import { ChevronRight, Flame, Components } from "@vicons/tabler";
import {
  AddCircleOutlineFilled,
  DoDisturbOnOutlined,
  ShoppingCartOutlined,
  CloseRound,
} from "@vicons/material";

interface ProductType {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

const hotItemsList = ref([
  {
    id: 1201,
    name: "NVIDIA GeForce RTX5090 32GB",
    price: "32999.00",
    description: "Blackwell 架构顶级GPU",
    image:
      "https://portaldoswargames.com.br/wp-content/uploads/2025/01/GeForce-RTX-5090-Tudo-Sobre-a-GPU-Mais-Poderosa-da-NVIDIA-com-Arquitetura-Blackwell.webp",
  },
  {
    id: 1202,
    name: "NVIDIA GeForce RTX4090 24GB",
    price: "32999.00",
    description: "Ada Lovelace 架构顶级GPU",
    image:
      "https://gao7pic.gao7.com/a4e6066e-1820-44ba-8bf8-7f435a05fef8.jpg?x-bce-process=image/resize,m_lfit,w_550",
  },
  {
    id: 1203,
    name: "NVIDIA H100 188GB",
    price: "2400000.00",
    description: "Hopper 架构顶级计算GPU",
    image: "https://www.leadtek.com/p_images/H100_01.jpg",
  },
  {
    id: 1204,
    name: "NVIDIA DGX B200 384GB",
    price: "4000000.00",
    description: "Blackwell 架构顶级计算服务器",
    image:
      "https://ts1.tc.mm.bing.net/th/id/R-C.2b3e1c939c9ba07ef2b905694e7645ae?rik=Djri42qAiuCH4A&riu=http%3a%2f%2fs.laoyaoba.com%2fjwImg%2fnews%2f2024%2f10%2f15%2f17289760929572.jpg&ehk=x7tzZjnPp8TDM358zd9uiisS1Y02zU3xlw0DNaaWgfA%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    id: 1205,
    name: "NVIDIA GeForce RTX5070Ti 16GB",
    price: "32999.00",
    description: "Blackwell 架构主流GPU",
    image:
      "https://portaldoswargames.com.br/wp-content/uploads/2025/01/GeForce-RTX-5090-Tudo-Sobre-a-GPU-Mais-Poderosa-da-NVIDIA-com-Arquitetura-Blackwell.webp",
  },
  {
    id: 1206,
    name: "NVIDIA GeForce RTX4070 Super 12GB",
    price: "32999.00",
    description: "Ada Lovelace 架构主流GPU",
    image:
      "https://gao7pic.gao7.com/a4e6066e-1820-44ba-8bf8-7f435a05fef8.jpg?x-bce-process=image/resize,m_lfit,w_550",
  },
  {
    id: 1207,
    name: "NVIDIA A100 80GB",
    price: "2400000.00",
    description: "Ampere 架构顶级计算GPU",
    image: "https://www.leadtek.com/p_images/H100_01.jpg",
  },
  {
    id: 1208,
    name: "NVIDIA A800 80GB",
    price: "4000000.00",
    description: "Ampere 架构顶级计算GPU",
    image:
      "https://ts1.tc.mm.bing.net/th/id/R-C.2b3e1c939c9ba07ef2b905694e7645ae?rik=Djri42qAiuCH4A&riu=http%3a%2f%2fs.laoyaoba.com%2fjwImg%2fnews%2f2024%2f10%2f15%2f17289760929572.jpg&ehk=x7tzZjnPp8TDM358zd9uiisS1Y02zU3xlw0DNaaWgfA%3d&risl=&pid=ImgRaw&r=0",
  },
]);

const normalItemsList = ref([
  {
    id: 2201,
    name: "零刻ME mini 双2.5G软路由迷你主机",
    price: "1295.00",
    description:
      "「多重玩法」零刻ME mini 英特尔N200 六盘位全闪nas网络存储器超静音私有云家庭存储双2.5G软路由迷你主机",
    image:
      "https://gw.alicdn.com/bao/uploaded/i3/2215672156562/O1CN01op3ZkG1yLS1wjO1Vx_!!2215672156562.jpg_.webp",
  },
  {
    id: 2202,
    name: "水月雨PILL音乐胶囊ows耳夹式无线耳机",
    price: "199.00",
    description: "水月雨PILL音乐胶囊ows耳夹式无线耳机蓝牙6.0运动跑步2025年新款",
    image:
      "https://img.alicdn.com/imgextra/i3/2212572610531/O1CN01QRfoPu1FnFMY1cTmZ_!!4611686018427387875-0-item_pic.jpg_.webp",
  },
  {
    id: 2203,
    name: "VXE蜻蜓R1无线鼠标",
    price: "89.00",
    description: "VXE蜻蜓R1无线鼠标 长续航无孔超轻量化人体工学",
    image:
      "https://gw.alicdn.com/imgextra/O1CN01Mbo9yr1fphUR64YUl_!!2218474464056-0-scmitem361000.jpg_.webp",
  },
  {
    id: 2204,
    name: "氧臣便携式制氧机5L",
    price: "1250.00",
    description: "氧臣便携式制氧机5L老人家用随身吸氧户外小型车载高原",
    image:
      "https://img.alicdn.com/imgextra/i4/2218376916658/O1CN01q1uNX61z3Q00n5BsR_!!2218376916658.jpg_.webp",
  },
  {
    id: 2205,
    name: "便携式雨披外出爬山一次性雨衣",
    price: "8.55",
    description: "短期旅游旅行神器必备用品小物件便携式雨披外出爬山一次性雨衣",
    image:
      "https://img.alicdn.com/imgextra/i2/2207305193510/O1CN01WYtOu81bnd8XbH7gt_!!2207305193510.jpg_.webp",
  },
  {
    id: 2206,
    name: "RTAKO迷你自拍杆",
    price: "57.80",
    description:
      "RTAKO迷你自拍杆2025新款落地三脚架拍照神器360度旋转手持旅游便携式手机通用vlog演唱会拍摄支架24",
    image:
      "https://img.alicdn.com/imgextra/i3/2167920960/O1CN01vj8fWQ1IxjGkEtjBN_!!4611686018427386176-0-item_pic.jpg_.webp",
  },
  {
    id: 2207,
    name: "便携式行李秤",
    price: "26.80",
    description: "便携式行李秤旅行出差神器出国留学必备用品日本欧洲旅游小物件",
    image:
      "https://gw.alicdn.com/bao/uploaded/i3/1027955690/O1CN01eW1Gxo1ru4eLuzeq2_!!1027955690.jpg_.webp",
  },
  {
    id: 2208,
    name: "海阁拉斯分体式太阳能",
    price: "278.00",
    description: "海阁拉斯分体式太阳能户外灯室内外家用庭院灯led照明投光灯防水",
    image:
      "https://gw.alicdn.com/bao/uploaded/i2/618249816/O1CN01H4b4O92MNmpIQujQj_!!618249816.jpg_.webp",
  },
  {
    id: 2209,
    name: "小米手环9Pro",
    price: "399.00",
    description:
      "小米手环9Pro 手环8Pro升级 运动健康防水睡眠心率智能手环运动手环NFC全面屏长续航支付",
    image:
      "https://img.alicdn.com/imgextra/i3/1714128138/O1CN01k2Gmrl29zGEdBQBgp-1714128138.jpg_.webp",
  },
  {
    id: 2210,
    name: "MINISO名创优品一次性内裤",
    price: "20.90",
    description: "MINISO名创优品一次性内裤女款纯棉无菌旅行女士产妇月子免洗日抛",
    image:
      "https://gw.alicdn.com/bao/uploaded/i1/3459177618/O1CN01VXV6Qb2696EOSH5HV_!!3459177618.jpg_.webp",
  },
  {
    id: 2211,
    name: "一次性袜子旅行必备神器",
    price: "20.30",
    description: "一次性袜子旅行必备神器八件套旅游洗漱用品套装外出酒店短期出差",
    image:
      "https://img.alicdn.com/imgextra/i1/3031825427/O1CN01UEIKnj1pxcTWQoJCa_!!4611686018427386899-0-item_pic.jpg_.webp",
  },
  {
    id: 2212,
    name: "TripPal睡猫u型枕头",
    price: "147.00",
    description: "TripPal睡猫u型枕头枕脖子护颈枕飞机旅行便携坐车睡觉颈椎u形枕",
    image:
      "https://img.alicdn.com/imgextra/i4/2210526975836/O1CN01A5Laak1sywUYJF12h_!!4611686018427385692-0-item_pic.jpg_.webp",
  },
  {
    id: 2213,
    name: "便携出差0酒精旅行床上除菌剂",
    price: "22.30",
    description: "hpv酒店厕所马桶消毒液床单杀菌喷雾便携出差0酒精旅行床上除菌剂",
    image:
      "https://gw.alicdn.com/bao/uploaded/i1/2208976692426/O1CN01amfY6J1Tn9r7HKUCm_!!2208976692426.jpg_.webp",
  },
  {
    id: 2214,
    name: "一次性液体旅行分装袋",
    price: "4.46",
    description: "一次性液体旅行分装袋化妆品洗发水乳液沐浴露护肤便携挤压分装袋",
    image:
      "https://img.alicdn.com/imgextra/i2/1068590472/O1CN01RcpUxQ1FMDzBj4YMw_!!1068590472.jpg_.webp",
  },
  {
    id: 2215,
    name: "MINISO名创优品一次性浴巾",
    price: "8.90",
    description: "MINISO名创优品一次性浴巾压缩毛巾加厚加大旅行用品便携单独包装",
    image:
      "https://gw.alicdn.com/bao/uploaded/i4/3459177618/O1CN01Y2vU6M26965QAUvGT_!!3459177618.jpg_.webp",
  },
  {
    id: 2216,
    name: "羽绒睡袋轻量化鹅绒",
    price: "242.00",
    description: "羽绒睡袋轻量化鹅绒成人户外露营旅行便携式打地铺车载用午休被子",
    image:
      "https://gw.alicdn.com/bao/uploaded/i3/635614111/O1CN01G8whHk1gEtF5YlAcJ_!!635614111.jpg_.webp",
  },
]);

// =================================================
// 商品信息模态框

const productDetailModal = ref(false);
const selectedProduct = ref<{ product: ProductType; count: number } | null>(null);

function handleOpenModal(product: ProductType) {
  productDetailModal.value = true;
  selectedProduct.value = { product, count: 1 };
}

// =================================================
// 购物车

const openShoppingCart = ref(false);
const shoppingCart = ref<{ product: ProductType; count: number }[]>([]);

/**
 * 将选中的商品添加到购物车里
 */
function addToShoppingCart() {
  let isInShoppingCart = false;
  shoppingCart.value.forEach(item => {
    if (item.product.id === selectedProduct.value?.product.id) {
      item.count += selectedProduct.value.count;
      isInShoppingCart = true;
    }
  });

  if (!isInShoppingCart) {
    shoppingCart.value.push(selectedProduct.value!);
  }

  productDetailModal.value = false;
}

/**
 * 根据商品在购物车里的索引位置，当商品数量为0时删除
 */
function removeFromShoppingCart(index: number) {
  shoppingCart.value.splice(index, 1);
}

/**
 * 计算购物车中的商品的总价格
 */
function calcTotalPrice() {
  let total = 0;
  shoppingCart.value.forEach(item => {
    total += item.count * parseFloat(item.product.price);
  });

  return total.toFixed(2);
}

// =================================================
</script>

<style scoped lang="less">
.mall-container {
  width: calc(100vw - 80px);
  margin-left: 80px;
  height: 100vh;
  box-sizing: border-box;
  padding: 40px;
}

.mall-content {
  overflow-y: auto;
  scrollbar-color: rgb(125, 125, 125) transparent;
}

.hot-item {
  cursor: pointer;
  transition-duration: 0.4s;
}

.hot-item-list {
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-color: rgb(125, 125, 125) transparent;
}

.hot-items-cover {
  pointer-events: none;
  background: linear-gradient(90deg, transparent 80%, var(--color-white) 95%);
}

.dark .hot-items-cover {
  pointer-events: none;
  background: linear-gradient(90deg, transparent 80%, var(--color-gray-900) 95%);
}

.items-container {
  grid-template-columns: repeat(auto-fill, 200px);
}

.item-info-container {
  transition-duration: 0.2s;
  box-sizing: border-box;
  padding: 5px;
}

.item-container:hover {
  .item-info-container {
    bottom: -50%;
  }
}

.shopping-cart-icon {
  transition: background 0.2s;
}

.shopping-cart {
  opacity: 0;
  transition: transform 0.3s, opacity 0s 0.3s;

  .shopping-cart__items {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.shopping-cart--open {
  opacity: 1;
  transform: translateX(-500px);
  transition: transform 0.3s;
}
</style>
