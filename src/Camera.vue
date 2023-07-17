<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_HOST } from './components/Const';

let pictureUrl = ref()
let checked: boolean = false
let timerId: number

onMounted(() => {

    updatePicture()

});

function changed(item:Event) {
    if (checked) {
        timerId = setInterval(updatePicture, 1000, true)
    } else {
        clearInterval(timerId);
    }
}

function updatePicture() {
    axios.get(API_HOST + '/raspicameradata')
        .then(response => {
            pictureUrl.value = 'data:image/png;base64,' + response.data.image;
        });
}

</script>

<template>
    <main>
        <router-link to="/">Back To Top</router-link>
        <h2>RaspberryPi カメラ</h2>
        <div>
            <input type="checkbox" id="autoUpdate" name="autoUpdate" v-model="checked" @change="changed">
            <label for="autoUpdate">Auto Update</label>
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