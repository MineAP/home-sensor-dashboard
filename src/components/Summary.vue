<script setup lang="ts">
import SummaryItem from './SummaryItem.vue'
import CpuIcon from './icons/IconCPU.vue'
import TempIcon from './icons/IconTemp.vue'
import CameraIcon from './icons/IconCamera.vue'
import axios from 'axios';
import { API_HOST } from './Const';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import moment from 'moment';

const cpu_clock = ref()
cpu_clock.value = "-"
const cpu_temp = ref()
cpu_temp.value = "-"
const cpu_update = ref()
cpu_update.value = "-"
const cpu_update_date_class_alert = ref(false)
cpu_update_date_class_alert.value = false

const room_humid = ref()
room_humid.value = "-"
const room_temp = ref()
room_temp.value = "-"
const room_humid_update = ref()
room_humid_update.value = "-"
const room_humid_update_class_alert = ref(false)
room_humid_update_class_alert.value = false

let pictureUrl = ref()

let timerId:number

onMounted(() => {
  
  timerId = setInterval(updateAllData, 5000)

  updateAllData()

})

onBeforeUnmount(() => {
  if (timerId) {
    console.log("top update timer has stopped.")
    clearInterval(timerId)
  }
})

function updateAllData() {
  axios.get(API_HOST + '/raspicpuinfo')
      .then(response => {
        cpu_clock.value = response.data["clock"];
        cpu_temp.value = response.data["temp"];
        cpu_update.value = response.data["timestamp"];
        const timestampStr = response.data["timestamp"];
        const timestamp = moment(timestampStr);
        if (timestampStr && timestamp.isValid()) {
          cpu_update.value = timestamp.fromNow()
          if (timestamp.diff(moment.now(), "minutes") < -30) {
            cpu_update_date_class_alert.value = true
          } else {
            cpu_update_date_class_alert.value = false
          }
        } else {
          cpu_update.value = "-"
          cpu_update_date_class_alert.value = true
        }
      });

  axios.get(API_HOST + '/sensorlogs/last')
      .then(response => {
        room_temp.value = response.data["temperature"];
        room_humid.value = response.data["humidity"];
        const timestampStr = response.data["timestamp"];
        const timestamp = moment(timestampStr);
        if (timestampStr && timestamp.isValid()) {
          room_humid_update.value = timestamp.fromNow()
          if (timestamp.diff(moment.now(), "minutes") < -30) {
            room_humid_update_class_alert.value = true
          } else {
            room_humid_update_class_alert.value = false
          }
        } else {
          room_humid_update.value = "-"
          room_humid_update_class_alert.value = true
        }
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
    <div class="table-infos">
      <table>
        <tr><td>CPUクロック:</td><td>{{ cpu_clock }} Hz</td></tr>
        <tr><td>CPU温度:</td><td>{{ cpu_temp }} ℃</td></tr>
      </table>
      <div class="update-date" :class="{ 'update-date-alert': cpu_update_date_class_alert }">updated at {{ cpu_update }}.</div>
    </div>
  </SummaryItem>

  <SummaryItem>
    <template #icon>
      <TempIcon />
    </template>
    <template #heading>Temperature and Humidity</template>
    RaspberryPiのセンサーで計測した現在の温度・湿度
    <div class="table-infos">
      <table>
        <tr><td>温度:</td><td>{{ room_temp }} ℃</td></tr>
        <tr><td>湿度:</td><td>{{ room_humid }} %</td></tr>
      </table>
      <div class="update-date" :class="{ 'update-date-alert': room_humid_update_class_alert }">updated at {{ room_humid_update }}.</div>
    </div>
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

.table-infos {
  margin: 10px;
}

img {
  width: 200px;
  min-width: 200px;
  min-height: 150px;
}

.update-date {
  font-size: small;
}

.update-date-alert {
  color: red;
  background-color: yellow;
}

</style>
