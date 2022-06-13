<template>
    <div class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x messagetoasts">
        <div class="toast align-items-center text-white border-0" :class="[ t.typeClass ]" role="alert" aria-live="assertive" aria-atomic="true" 
            v-for="t in toastList" :key="t.time" :id="'toast-' + t.time">
            <div class="d-flex">
                <div class="toast-body">
                {{t.message}}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.messagetoasts{
    z-index: 2000;
}
</style>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { nextTick } from '@vue/runtime-core';
import globalBus from '../gstatus/globalBus';
import sleep from '../utils/sleep';
import { Toast } from 'bootstrap';

const toastList = ref<ToastItem[]>([]);

interface ToastItem {
    message: string;
    typeClass: string;
    time: number;
}

globalBus.on("message", (data) => {
  let messageData: ToastItem = {
      typeClass: `bg-${data.type}`,
      message: data.message,
      time: (new Date()).getTime()
  };

  toastList.value.push(messageData);

  nextTick(async () => {
      let el = document.getElementById('toast-' + messageData.time);
      if (!el) return;
      let toast = new Toast(el, {
          autohide: false
      });
      toast.show();

      await sleep(5000);
      toast.hide();
      await sleep(1000);
      toastList.value.splice(toastList.value.indexOf(messageData), 1);
  });
});
</script>