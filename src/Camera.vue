<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { requestJson } from './utils/api';

let pictureUrl = ref()
const tempAutoUpdate = localStorage.getItem("autoUpdateChecked")
let autoUpdateChecked: boolean = (tempAutoUpdate == "true")
const tempMovenetEnable = localStorage.getItem("movenetEnableChecked")
let movenetEnableChecked: boolean = (tempMovenetEnable == "true")
let timerId: number

onMounted(() => {

    updatePicture()

    if (autoUpdateChecked) {
        timerId = setInterval(updatePicture, 1000, true)
    }

});

onBeforeUnmount(() => {
    if (timerId) {
        console.log("camera update timer has stopped.")
        clearInterval(timerId)
    }
})

function autoUpdateChanged(item:Event) {
    if (autoUpdateChecked) {
        timerId = setInterval(updatePicture, 1000, true)
    } else {
        clearInterval(timerId);
    }
    localStorage.setItem("autoUpdateChecked", `${autoUpdateChecked}`)
}

function movenetEnableChanged(item:Event) {
    localStorage.setItem("movenetEnableChecked", `${movenetEnableChecked}`)
}

function updatePicture() {
    requestJson<{ image: string }>('/raspicameradata')
        .then(response => {
            if (movenetEnableChecked) {
                execPostureEstimation(response.image)
            } else {
                pictureUrl.value = 'data:image/png;base64,' + response.image;
            }
        })
        .catch(error => {
            autoUpdateChecked = false
            alert(error)
        });        
}

function execPostureEstimation(base64img:string) {
    requestJson<{ image: string }>('/movenet/inference/', {
        method: 'POST',
        body: { image: base64img },
    })
        .then(response => {
            pictureUrl.value = 'data:image/png;base64,' + response.image;
        })
        .catch(error => {
            movenetEnableChecked = false
            pictureUrl.value = 'data:image/png;base64,' + base64img;
            alert(error)
        })
}

</script>

<template>
    <main class="camera-page">
        <router-link class="back-link" to="/">Back To Top</router-link>
        <h2>RaspberryPi カメラ</h2>
        <p class="page-note">現在の映像と姿勢推定の有無を切り替えながら確認できます。</p>
        <div class="camera-controls">
            <div class="camera-options">
                <input type="checkbox" id="autoUpdate" name="autoUpdate" v-model="autoUpdateChecked" @change="autoUpdateChanged">
                <label for="autoUpdate">Auto Update</label>
            </div>
            <div class="camera-options">
                <input type="checkbox" id="movenet" name="movenet" v-model="movenetEnableChecked" @change="movenetEnableChanged">
                <label for="movenet">Posture estimation</label>
            </div>
        </div>
        <div class="camera-frame">
            <img v-bind:src="pictureUrl" ref="img" />
        </div>
    </main>
</template>

<style scoped>

main {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 0 2rem;
}

.camera-page {
    display: grid;
    align-content: start;
    grid-auto-rows: min-content;
    gap: 0.55rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 34px;
    padding: 0 0.58rem;
    box-sizing: border-box;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
    font-size: 0.88rem;
    line-height: 1;
}

h2 {
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.02em;
}

.page-note {
    margin: -0.2rem 0 0.05rem;
    color: var(--color-text);
    opacity: 0.82;
    line-height: 1.45;
}

.camera-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
    margin-top: -0.1rem;
}

.camera-options {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.52rem;
    width: fit-content;
    border: 1px solid rgba(148, 163, 184, 0.22);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.camera-options label {
    font-size: 0.9rem;
}

.camera-frame {
    width: 100%;
    margin-top: 0.02rem;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 22px;
    background: rgba(248, 250, 252, 0.96);
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
}

img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    background: transparent;
}

</style>
