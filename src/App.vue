<template>
  <BottomBar></BottomBar>
  <Modal></Modal>
  <MessageToasts></MessageToasts>
  <div class="app-main-view">
    <router-view v-if="isRouterVisible"></router-view>
  </div>
  <BottomFooter></BottomFooter>
</template>

<script setup lang="ts">
import globalStatus from './gstatus/status';
import globalBus from './gstatus/globalBus';
import Modal from './components/Modal.vue'
import MessageToasts from './components/MessageToasts.vue'
import BottomFooter from './components/BottomFooter.vue'
import BottomBar from './components/BottomBar.vue'
import { ref, nextTick } from 'vue'

console.log("CCXC Engine v1.1 created by Ted Zyzsdy, supported by MeowSound Idols.");
globalStatus.isLogin = localStorage.getItem("token") == null;
globalStatus.username = localStorage.getItem("username") || "[][NULL]";

const isRouterVisible = ref(true);

globalBus.on("reload", () => {
  isRouterVisible.value = false;
  nextTick(() => {
    isRouterVisible.value = true;
  });
});
</script>

<style lang="scss">
//覆盖bootstrap的默认变量
$enable-rounded: false;
$blue: #0046FF;
$red: #FF4C4F;
$orange: #FF7E00;
$background: #1A1A1A;

//引入bootstrap
@import "../node_modules/bootstrap/scss/bootstrap";

body{
  margin: 0;
  background-color: $background;
  color: white;
}
.center{
    text-align: center;
}
.header-line{
    margin-top: 60px;
    margin-bottom: 75px;
}
.app-main-view{
  min-height: 120vh;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(165, 165, 165, 0.306);
  border-radius: 5px;
  transition: all 0.35s linear;
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(165, 165, 165);
}

@font-face {
  font-family: 'ccbc12symbols';
  src: url('./assets/ccbc12symbols-Regular-SVG.woff2') format('woff2'), /* Modern Browsers */
        url('./assets/ccbc12symbols-Regular-SVG.otf') format('opentype'); /* Safari, Android, iOS */
  font-style: normal;
  font-weight: normal;
  text-rendering: optimizeLegibility;
}
</style>
