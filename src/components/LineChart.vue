<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { type Ref } from 'vue';
import axios from 'axios';
import moment from 'moment';
import { API_HOST } from './Const';

const count = ref()

const tempHistoryCount = localStorage.getItem("tempHistoryCount")
count.value = Number(tempHistoryCount) | 100
const canvas1Ref = ref()
const canvas2Ref = ref()

let chart1:Chart | undefined
let chart2:Chart | undefined

onMounted(() => {
    updateCharts()
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
})

function onResize() {
    if (chart1) {
        chart1.update();
    }
    if (chart2) {
        chart2.update();
    }
}

function updateCharts() {

    localStorage.setItem("tempHistoryCount", count.value)

    collectData().then((response) => {

        chart1 = createCharts(chart1, canvas1Ref, "温度(C)", "rgba(255,0,0,1)", response.labels, response.temp);
        chart2 = createCharts(chart2, canvas2Ref, "湿度(%)", "rgba(0,0,255,1)", response.labels, response.humid);

    });

}

function createCharts (chart:Chart | undefined, canvasRef:Ref, title:string, color:string, labels:string[], data:number[]) : Chart | undefined {
    if (canvasRef.value === null) return undefined;
    const canvas = canvasRef.value.getContext("2d");
    if (canvas === null) return undefined;
    console.log(canvas.value?.getContext("2d"));
    
    if (chart) {
        chart.data.labels = labels
        chart.data.datasets = [{
            label: title,
            data: data,
            borderColor: color
        }]
        chart.update();
    } else {
        chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    borderColor: color
                }]
            }
        });
    }
    
    console.log(chart);

    return chart
}

async function collectData() : Promise<ApiResult> {

    const tmpCount:number = Number(count.value) || 100 

    const { data } = await axios.get(API_HOST + `/sensorlogs?count=${tmpCount}`)

    let labels:string[] = []
    let data1:number[] = []
    let data2:number[] = []

    if (data instanceof Array) {
        data.reverse().forEach(element => {
            data1.push(Number(element["temperature"]))
            data2.push(Number(element["humidity"]))
            labels.push(moment(element["timestamp"]).format("M/D H:mm:ss"))
        });
    }

    const result:ApiResult = {
        labels : labels,
        temp : data1,
        humid : data2
    }

    return result
}

interface ApiResult {
    labels: string[]
    temp: number[]
    humid: number[]
}

</script>

<template>
    <div>
        <input v-model="count" placeholder="" type="number" min="100" max="10000" step="100">
        <button @click="updateCharts()">更新</button>
        <canvas ref="canvas1Ref"  />
        <canvas ref="canvas2Ref"  />
    </div>
</template>

<style module>

canvas {
    width: 90vw;
    min-width: 800px;
    max-height: 400px;
}

</style>