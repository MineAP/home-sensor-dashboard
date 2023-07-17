<script setup lang="ts">
import SummaryItem from './SummaryItem.vue'
import CpuIcon from './icons/IconCPU.vue'
import TempIcon from './icons/IconTemp.vue'
import CameraIcon from './icons/IconCamera.vue'
import axios from 'axios';
import { API_HOST } from './Const';
import { ref, onMounted } from 'vue';

const cpu_clock = ref()
cpu_clock.value = "-"
const cpu_temp = ref()
cpu_temp.value = "-"
const room_humid = ref()
room_humid.value = "-"
const room_temp = ref()
room_temp.value = "-"
let pictureUrl = ref()

onMounted(() => {
  
  setInterval(updateAllData, 5000)

  updateAllData()

})

function updateAllData() {
  axios.get(API_HOST + '/raspicpuinfo')
      .then(response => {
        cpu_clock.value = response.data["clock"];
        cpu_temp.value = response.data["temp"];
      });

  axios.get(API_HOST + '/sensorlogs/last')
      .then(response => {
        room_temp.value = response.data["temperature"];
        room_humid.value = response.data["humidity"];
      });

  axios.get(API_HOST + '/raspicameradata/')
      .then(response => {
        pictureUrl.value = 'data:image/png;base64,' + response.data.image;
      });
}

</script>

<template>
  <SummaryItem>
    <template #icon>
      <CpuIcon />
    </template>
    <template #heading>RaspberryPi CPU Info</template>
    RaspberryPiの現在のCPUの状態
    <table>
      <tr><td>CPUクロック:</td><td>{{ cpu_clock }} Hz</td></tr>
      <tr><td>CPU温度:</td><td>{{ cpu_temp }} ℃</td></tr>
    </table>
  </SummaryItem>

  <SummaryItem>
    <template #icon>
      <TempIcon />
    </template>
    <template #heading>Temperature and Humidity</template>
    RaspberryPiのセンサーで計測した現在の温度・湿度
    <table>
      <tr><td>温度:</td><td>{{ room_temp }} ℃</td></tr>
      <tr><td>湿度:</td><td>{{ room_humid }} %</td></tr>
    </table>
    <br />
    温度・湿度の履歴は<router-link to="/temphistory">こちら</router-link>
  </SummaryItem>

  <SummaryItem>
    <template #icon>
      <CameraIcon />
    </template>
    <template #heading>RaspberryPi Camera</template>
    最新のRaspberryPiカメラの画像
    <br />
    <router-link to="/camera">
      <img v-bind:src="pictureUrl" ref="img" />
    </router-link>
  </SummaryItem>
</template>

<style scoped>

table {
  margin: 10px;
}

img {
  width: 200px;
  min-width: 200px;
  min-height: 150px;
}

</style>
