<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { type Ref } from 'vue';
import moment from 'moment';
import { requestJson } from '../utils/api';

const count = ref<number>(100)

const tempHistoryCount = localStorage.getItem("tempHistoryCount")
count.value = Number(tempHistoryCount) || 100
const canvas1Ref = ref<HTMLCanvasElement | null>(null)
const canvas2Ref = ref<HTMLCanvasElement | null>(null)

const lastUpdateDate = ref<string>('-')
lastUpdateDate.value = "-"

let chart1:Chart | undefined
let chart2:Chart | undefined

type DayBoundaryChart = Chart & {
    dayBoundaryIndices?: number[]
    dayBoundaryLabels?: string[]
    showDayBoundaryLabels?: boolean
}

const dayBoundaryPlugin = {
    id: 'dayBoundaryPlugin',
    afterDatasetsDraw(chart: Chart) {
        const boundaryChart = chart as DayBoundaryChart
        const boundaryIndices = boundaryChart.dayBoundaryIndices ?? []
        const boundaryLabels = boundaryChart.dayBoundaryLabels ?? []
        const showDayBoundaryLabels = boundaryChart.showDayBoundaryLabels ?? false

        if (boundaryIndices.length === 0) return

        const xScale = chart.scales.x
        const { ctx, chartArea } = chart

        ctx.save()
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.36)'
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])

        boundaryIndices.forEach((index, boundaryNumber) => {
            const label = boundaryLabels[boundaryNumber] ?? ''
            const x = xScale.getPixelForValue(index)
            if (x < chartArea.left || x > chartArea.right) return

            ctx.beginPath()
            ctx.moveTo(x, chartArea.top)
            ctx.lineTo(x, chartArea.bottom)
            ctx.stroke()

            if (showDayBoundaryLabels && label !== '') {
                const textY = chartArea.top + 2
                ctx.font = 'bold 14px sans-serif'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'top'

                const textWidth = ctx.measureText(label).width
                const paddingX = 8
                const paddingY = 5
                const boxWidth = textWidth + paddingX * 2
                const boxHeight = 14 + paddingY * 2
                const boxX = x - boxWidth / 2
                const boxY = textY

                ctx.fillStyle = 'rgba(0, 0, 0, 0.72)'
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
                ctx.lineWidth = 1
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
                ctx.fillStyle = 'white'
                ctx.fillText(label, x, boxY + paddingY)
            }
        })

        ctx.restore()
    }
}

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

    localStorage.setItem("tempHistoryCount", String(count.value))

    collectData().then((response) => {

        chart1 = createCharts(chart1, canvas1Ref, "温度(C)", "rgba(255,0,0,1)", response.labels, response.temp, response.dayBoundaryIndices, response.dayBoundaryLabels, true);
        chart2 = createCharts(chart2, canvas2Ref, "湿度(%)", "rgba(0,0,255,1)", response.labels, response.humid, response.dayBoundaryIndices, response.dayBoundaryLabels, false);

    });

}

function createCharts (
    chart:Chart | undefined,
    canvasRef:Ref<HTMLCanvasElement | null>,
    title:string,
    color:string,
    labels:string[],
    data:number[],
    dayBoundaryIndices:number[],
    dayBoundaryLabels:string[],
    showDayBoundaryLabels:boolean
) : Chart | undefined {
    if (canvasRef.value === null) return undefined;
    const canvas = canvasRef.value.getContext("2d");
    if (canvas === null) return undefined;
    
    if (chart) {
        chart.data.labels = labels
        chart.data.datasets = [{
            label: title,
            data: data,
            borderColor: color
        }]
        ;(chart as DayBoundaryChart).dayBoundaryIndices = dayBoundaryIndices
        ;(chart as DayBoundaryChart).dayBoundaryLabels = dayBoundaryLabels
        ;(chart as DayBoundaryChart).showDayBoundaryLabels = showDayBoundaryLabels
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
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    }
                }
            },
            plugins: [dayBoundaryPlugin]
        });
        ;(chart as DayBoundaryChart).dayBoundaryIndices = dayBoundaryIndices
        ;(chart as DayBoundaryChart).dayBoundaryLabels = dayBoundaryLabels
        ;(chart as DayBoundaryChart).showDayBoundaryLabels = showDayBoundaryLabels
        chart.update();
    }

    return chart
}

async function collectData() : Promise<ApiResult> {

    const tmpCount:number = Number(count.value) || 100 

    const data = await requestJson<ApiLog[]>(`/sensorlogs?count=${tmpCount}`)

    let labels:string[] = []
    let data1:number[] = []
    let data2:number[] = []
    let dayBoundaryIndices:number[] = []
    let dayBoundaryLabels:string[] = []
    let previousDay:string | undefined

    if (data instanceof Array) {
        const list = data.reverse()
        list.forEach(element => {
            data1.push(Number(element["temperature"]))
            data2.push(Number(element["humidity"]))
            const timestamp = moment(element["timestamp"])
            const currentDay = timestamp.format("YYYY-MM-DD")
            if (previousDay !== undefined && previousDay !== currentDay) {
                dayBoundaryIndices.push(labels.length)
                dayBoundaryLabels.push(timestamp.format("M/D"))
            }
            previousDay = currentDay
            labels.push(timestamp.format("M/D H:mm:ss"))
        });
        if (list.length > 0) {
            const last = list[list.length-1]
            lastUpdateDate.value = moment(last["timestamp"]).format("M/D H:mm:ss")
        }
    }

    const result:ApiResult = {
        labels : labels,
        temp : data1,
        humid : data2,
        dayBoundaryIndices : dayBoundaryIndices,
        dayBoundaryLabels : dayBoundaryLabels
    }

    return result
}

interface ApiResult {
    labels: string[]
    temp: number[]
    humid: number[]
    dayBoundaryIndices: number[]
    dayBoundaryLabels: string[]
}

interface ApiLog {
    temperature: number | string
    humidity: number | string
    timestamp: string
}

</script>

<template>
    <div class="chart-stack">
        <div class="chart-controls">
            <div class="chart-control">
                <input v-model="count" placeholder="" type="number" min="100" max="10000" step="100">
                <button @click="updateCharts()">更新</button>
            </div>
            <div class="chart-update-date">温度・湿度の最終更新日時：{{ lastUpdateDate }}</div>
        </div>
        <div class="chart-scroll">
            <div class="chart-surface">
                <canvas ref="canvas1Ref" />
            </div>
        </div>
        <div class="chart-scroll">
            <div class="chart-surface">
                <canvas ref="canvas2Ref" />
            </div>
        </div>
    </div>
</template>

<style scoped>

.chart-stack {
    display: grid;
    gap: 0.55rem;
}

.chart-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
}

.chart-control {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.52rem;
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.chart-control input {
    width: 76px;
}

.chart-control button {
    padding: 0.2rem 0.6rem;
}

.chart-update-date {
    display: inline-flex;
    align-items: center;
    padding: 0.28rem 0.55rem;
    font-size: 0.85rem;
    line-height: 1.2;
    color: rgba(71, 85, 105, 0.95);
    background: rgba(148, 163, 184, 0.12);
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 999px;
}

.chart-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}

.chart-surface {
    width: 100%;
    min-width: 800px;
    height: 400px;
}

canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
}

</style>
