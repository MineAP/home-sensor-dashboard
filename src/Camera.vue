<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_HOST } from './components/Const';

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
    axios.get(API_HOST + '/raspicameradata')
        .then(response => {
            if (movenetEnableChecked) {
                execPostureEstimation(response.data.image)
            } else {
                pictureUrl.value = 'data:image/png;base64,' + response.data.image;
            }
        })
        .catch(error => {
            alert(error)
        });        
}

function execPostureEstimation(base64img:string) {

    axios.post(API_HOST + '/movenet/inference/', {image: base64img})
        .then(response => {
            pictureUrl.value = 'data:image/png;base64,' + btoa(response.data);
        })
        .catch(error => {
            pictureUrl.value = 'data:image/png;base64,' + base64img;
        })
}

</script>

<template>
    <main>
        <router-link to="/">Back To Top</router-link>
        <h2>RaspberryPi カメラ</h2>
        <div>
            <input type="checkbox" id="autoUpdate" name="autoUpdate" v-model="autoUpdateChecked" @change="autoUpdateChanged">
            <label for="autoUpdate">Auto Update</label>
        </div>
        <div>
            <input type="checkbox" id="movenet" name="movenet" v-model="movenetEnableChecked" @change="movenetEnableChanged">
            <label for="movenet">Posture estimation</label>

        </div>
        <img v-bind:src="pictureUrl" ref="img" />
    </main>
</template>

<style scoped>

img {
    width: 100%;
    min-width: 1027px;
    min-height: 768px;
}

</style>