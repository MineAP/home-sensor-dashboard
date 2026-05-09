<script setup lang="ts">
import SummaryItem from './SummaryItem.vue'
import CpuIcon from './icons/IconCPU.vue'
import TempIcon from './icons/IconTemp.vue'
import CameraIcon from './icons/IconCamera.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue';
import moment from 'moment';
import { requestJson } from '../utils/api';

type UpdateMockMode = 'normal' | 'stale' | 'invalid'
type TimestampState = {
  label: string
  alert: boolean
}

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

const updateMockMode = getInitialMockMode()

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

function getInitialMockMode(): UpdateMockMode {
  const queryMode = new URLSearchParams(window.location.search).get('summaryUpdateMockMode')
  if (queryMode === 'normal' || queryMode === 'stale' || queryMode === 'invalid') {
    return queryMode
  }

  const envMode = import.meta.env.VITE_SUMMARY_UPDATE_MOCK_MODE
  if (envMode === 'normal' || envMode === 'stale' || envMode === 'invalid') {
    return envMode
  }

  return 'normal'
}

function getTimestampState(timestampStr: string, timestamp: moment.Moment): TimestampState {
  if (!timestampStr || !timestamp.isValid()) {
    return {
      label: '-',
      alert: true
    }
  }

  if (updateMockMode === 'invalid') {
    return {
      label: '-',
      alert: true
    }
  }

  if (updateMockMode === 'stale') {
    return {
      label: `${timestamp.clone().subtract(2, 'hours').fromNow()} (mock)`,
      alert: true
    }
  }

  return {
    label: timestamp.fromNow(),
    alert: timestamp.diff(moment.now(), 'minutes') < -30
  }
}

function updateAllData() {
  requestJson<ApiCpuInfo>('/raspicpuinfo')
      .then(response => {
        cpu_clock.value = response["clock"];
        cpu_temp.value = response["temp"];
        const timestampStr = response["timestamp"];
        const timestamp = moment(timestampStr);
        const state = getTimestampState(timestampStr, timestamp)
        cpu_update.value = state.label
        cpu_update_date_class_alert.value = state.alert
      });

  requestJson<ApiSensorLog>('/sensorlogs/last')
      .then(response => {
        room_temp.value = response["temperature"];
        room_humid.value = response["humidity"];
        const timestampStr = response["timestamp"];
        const timestamp = moment(timestampStr);
        const state = getTimestampState(timestampStr, timestamp)
        room_humid_update.value = state.label
        room_humid_update_class_alert.value = state.alert
      });

  requestJson<{ image: string }>('/raspicameradata/')
      .then(response => {
        pictureUrl.value = 'data:image/png;base64,' + response.image;
      });
}

interface ApiCpuInfo {
  clock: string | number
  temp: string | number
  timestamp: string
}

interface ApiSensorLog {
  temperature: string | number
  humidity: string | number
  timestamp: string
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
    <router-link class="history-link" to="/temphistory">履歴を見る →</router-link>
  </SummaryItem>

  <SummaryItem>
    <template #icon>
      <CameraIcon />
    </template>
    <template #heading>RaspberryPi Camera</template>
    最新のRaspberryPiカメラの画像
    <br />
    <router-link to="/camera">
      <div class="camera-preview-label">カメラ</div>
      <div class="camera-preview">
        <img v-bind:src="pictureUrl" ref="img" />
      </div>
    </router-link>
  </SummaryItem>
</template>

<style scoped>
.table-infos {
  margin-top: 0.9rem;
}

img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-preview {
  width: min(100%, 320px);
  aspect-ratio: 4 / 3;
  margin-top: 0.6rem;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--color-surface-border);
  background: linear-gradient(180deg, var(--color-surface-strong), var(--color-surface));
  box-shadow: 0 14px 28px var(--color-surface-shadow);
}

.camera-preview-label {
  display: inline-flex;
  align-items: center;
  margin-top: 0.6rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: var(--color-accent-soft-strong);
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.update-date {
  display: inline-flex;
  align-items: center;
  margin-top: 0.45rem;
  padding: 0.2rem 0.55rem;
  font-size: 0.85rem;
  line-height: 1.2;
  color: var(--color-text);
  background: rgba(148, 163, 184, 0.18);
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 999px;
}

.update-date-alert {
  color: var(--color-warning);
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.3);
}

.table-infos table {
  border-collapse: collapse;
}

.table-infos td {
  padding: 0.22rem 0.35rem 0.22rem 0;
}

.table-infos td:first-child {
  color: var(--color-text);
  opacity: 0.8;
}

.table-infos td:last-child {
  font-weight: 600;
}

.update-date-alert::before {
  content: '';
  width: 0.55rem;
  height: 0.55rem;
  margin-right: 0.4rem;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.7;
}

a {
  font-weight: 600;
  color: inherit;
}

.history-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.25rem;
  padding: 0.22rem 0.68rem;
  border-radius: 999px;
  border: 1px solid var(--color-accent-border-strong);
  background: var(--color-accent-soft-strong);
  color: var(--color-accent);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.history-link:hover {
  text-decoration: none;
  background: rgba(45, 212, 191, 0.24);
  border-color: rgba(45, 212, 191, 0.42);
}

</style>
