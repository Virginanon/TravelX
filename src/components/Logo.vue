<template>
  <div :style="`color: ${color};`" class="logo-container flex items-center">
    <div v-if="showLogo" :style="`width: ${size}px; height: ${size}px;`" class="logo-svg object-cover">
      <svg :style="logoStyle" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 4096 4096"
        style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
          <path style="opacity:0.995" fill="currentColor"
            d="M 1536.5,837.5 C 1786.94,838.664 2010.27,915.831 2206.5,1069C 2250.63,1104.46 2291.63,1143.46 2329.5,1186C 2561.64,1141.68 2784.31,1170.35 2997.5,1272C 3219.44,1383.28 3384.28,1550.78 3492,1774.5C 3583.62,1975.42 3610.28,2184.76 3572,2402.5C 3525.19,2653.07 3404.36,2859.24 3209.5,3021C 3013.77,3175.92 2790.27,3254.09 2539,3255.5C 2286.85,3254.35 2062.68,3175.85 1866.5,3020C 1823.3,2984.8 1783.3,2946.14 1746.5,2904C 1672.19,2919.44 1597.02,2927.27 1521,2927.5C 1286.21,2924.48 1078.05,2849.64 896.5,2703C 712.57,2550.11 591.737,2356.95 534,2123.5C 485.073,1904.29 502.74,1690.62 587,1482.5C 684.289,1254.22 841.456,1080.05 1058.5,960C 1207.99,880.628 1367.32,839.795 1536.5,837.5 Z M 1525.5,1067.5 C 1678.19,1063.92 1819.85,1101.42 1950.5,1180C 1995.57,1207.03 2037.57,1238.2 2076.5,1273.5C 1858.86,1383.3 1696.36,1547.64 1589,1766.5C 1489.2,1981.5 1463.53,2205.17 1512,2437.5C 1530.97,2526.57 1561.13,2611.57 1602.5,2692.5C 1602.29,2693.09 1601.96,2693.59 1601.5,2694C 1449.56,2707.51 1307.56,2676.18 1175.5,2600C 1001.06,2494.87 878.224,2346.7 807,2155.5C 738.723,1960.89 741.39,1767.22 815,1574.5C 874.081,1427.43 967.581,1307.27 1095.5,1214C 1224.4,1123.64 1367.74,1074.81 1525.5,1067.5 Z M 2516.5,1400.5 C 2677.03,1396.71 2826.03,1435.88 2963.5,1518C 3129.56,1624.11 3242.06,1771.61 3301,1960.5C 3343.43,2103.04 3349.1,2247.04 3318,2392.5C 3266.45,2606.61 3149.28,2774.11 2966.5,2895C 2791.39,3004.58 2601.72,3042.25 2397.5,3008C 2245.09,2978.63 2112.09,2911.96 1998.5,2808C 2191.41,2695.4 2326.91,2534.23 2405,2324.5C 2443.07,2219.16 2464.07,2110.49 2468,1998.5C 2468.5,1957.17 2468.67,1915.83 2468.5,1874.5C 2248.5,1874.83 2028.5,1874.5 1808.5,1873.5C 1877.04,1717.46 1984.37,1595.63 2130.5,1508C 2250.14,1439.76 2378.81,1403.92 2516.5,1400.5 Z M 1745.5,2103.5 C 1894.17,2103.5 2042.83,2103.5 2191.5,2103.5C 2186.77,2200.84 2158.27,2290.51 2106,2372.5C 2039.14,2475.03 1952.14,2555.69 1845,2614.5C 1756.97,2455.02 1723.8,2284.69 1745.5,2103.5 Z" />
        </g>
      </svg>
    </div>
    <div :class="`flex ${horizontalName ? '' : 'flex-col'}`">
      <div v-if="showName" :style="textStyle" class="logo-text">
        {{ name }}
      </div>
      <div v-if="smallName" :class="`small-text ${horizontalName ? 'small-vertical' : ''}`">
        {{ smallName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

/* TIPS
Props参数介绍：
{
  size: Logo大小,
  name: Logo后面大文本内容,
  smallName: Logo右下角字符内容,
  color: 覆盖颜色,
  logoStyle: Logo样式覆盖,
  textStyle: 大文本样式覆盖,
  smTextStyle: 小文本样式覆盖,
  horizontalName: 是否为水平放置名称,
  showName: 是否显示名称,
  showLogo: 是否显示Logo
}
*/

const props = withDefaults(
  defineProps<{
    size?: number,
    name?: string,
    smallName?: string,
    color?: string,
    logoStyle?: string,
    textStyle?: string,
    smTextStyle?: string,
    horizontalName?: boolean,
    showName?: boolean,
    showLogo?: boolean
  }>(),
  {
    size: 55,
    name: 'SmartGo',
    smallName: '',
    color: '',
    logoStyle: '',
    textStyle: '',
    smTextStyle: '',
    horizontalName: false,
    showName: true,
    showLogo: true
  }
)
</script>

<style scoped lang="less">
.logo-text {
  font-family: 'Futura', sans-serif;
  font-size: 1.7rem;
}

.small-text {
  font-family: sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
}

.small-vertical {
  font-size: 1.7rem;
  margin-left: 5px;
}
</style>