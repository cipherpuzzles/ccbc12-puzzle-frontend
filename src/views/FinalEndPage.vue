<template>
    <div class="container-md">
        <div class="row header-line center">
            <div class="col">
                <div>CCBC 12</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="pHtmlContainer" v-html="finalEndHtml"></div>
            </div>
        </div>
        <div class="row header-line center">
            <div class="col">
                <a class="btn btn-primary" href="https://ccbc12.cipherpuzzles.com">返回CCBC 12主页</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import isLogin from '../utils/isLogin';
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/fetchPost"
import gConst from '../gstatus/const';
import { marked } from "marked";

import type { BasicResponse } from '../utils/fetchPost';

const router = useRouter();
const finalEndHtml = ref("");
const rankTemp = ref(0);
onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }
    
    await loadFinalEnd(); 
});

interface FinalEndResponse extends BasicResponse{
    rank_temp: number;
}

async function loadFinalEnd() {
    let api = gConst.apiRoot + "/play/get-final-end";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as FinalEndResponse;

    if (data.status === 1) {
        rankTemp.value = data.rank_temp;

        let html = marked(data.message);
        finalEndHtml.value = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
            nextTick(() => {
                let rankfunction = eval(js);
                let extraText = rankfunction(rankTemp.value) || "";
                finalEndHtml.value += marked(extraText);
            });
            return "";
        });
    } else {
        defaultApiErrorAction(data);
    }
}
</script>