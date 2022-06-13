<template>
    <div class="container-md">
        <div class="row header-line center">
            <div class="col">
                <div>CCBC 12</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <PrologueScriptRender :script="prologueScript" @next="goNext"></PrologueScriptRender>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import isLogin from '../utils/isLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/fetchPost"
import gConst from "../gstatus/const"
import PrologueScriptRender from '../components/PrologueScriptRender.vue';

import type { BasicResponse } from '../utils/fetchPost';

const router = useRouter();

const prologueScript = ref("");

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }
    
    await reloadPrologueHtml(); 
});

async function reloadPrologueHtml() {
    let api = gConst.apiRoot + "/play/get-preface";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as BasicResponse;

    if (data.status == 1) {
        prologueScript.value = data.message;
    } else {
        defaultApiErrorAction(data);
    }
}

function goNext() {
    localStorage.setItem('navbar-step', "bar2nd-status");
    router.push('/main');
}
</script>
