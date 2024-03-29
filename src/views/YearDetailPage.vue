<template>
    <div class="container-md">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 12</div>
                <h4 class="title-line">
                    <span :class="[isYearBold ? 'title-line-bold-year' : '']" class="title-line-title" v-if="puzzle.second_key < 9900000">{{ puzzle.second_key }}</span>
                    <span>{{ puzzle.title }}</span>
                </h4>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-html="renderedHtml"></div>
            </div>
        </div>
        <div class="row" v-if="puzzle.is_finish == 1 && puzzle.extend_content && puzzle.extend_content != ''">
            <div class="col">
                <div class="alert alert-dark">
                    <h5>隐藏的内容</h5>
                    <hr/>
                    <div v-html="renderedExtendHtml"></div>
                </div>
            </div>
        </div>
        <div class="row" v-if="spContentUseCalc">
            <div class="col">
                <SpCalc></SpCalc>
            </div>
        </div>
        <div class="row" v-if="spContentUseLightGame">
            <div class="col">
                <SpLightgame></SpLightgame>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="puzzle.type == 0">
                    <a :href="puzzle.image" target="_blank"><img class="puzzle-image" :src="puzzle.image"></a>
                </div>
                <div v-if="puzzle.type == 1" v-html="puzzle.html" id="puzzleHtml">

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.puzzle-image{
    width: 100%;
}
.title-line{
    margin-top: 1.2rem;
}
.title-line-bold-year {
    font-weight: bold;
}
.title-line-title {
    margin-right: 2rem;
}
</style>

<script setup lang="ts">
import { Tooltip } from 'bootstrap';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import isLogin from '../utils/isLogin'
import { useRoute, useRouter } from "vue-router";
import gConst from '../gstatus/const';
import globalStatus from '../gstatus/status';
import { BasicResponse, defaultApiErrorAction, fetchPostWithSign } from '../utils/fetchPost';
import { marked } from 'marked'
import globalBus from '../gstatus/globalBus';

import SpCalc from '../components/puzzlesParts/spCalc.vue';
import SpLightgame from '../components/puzzlesParts/spLightgame.vue';

const route = useRoute();
const router = useRouter();

const puzzle = reactive<PuzzleItem>({
    pid: 0,
    second_key: 0,
    type: 0,
    title: "",
    content: "",
    image: "",
    html: "",
    answer_type: 0,
    extend_content: "",
    is_finish: 0
});

interface PuzzleItem {
    pid: number;
    second_key: number;
    type: number;
    title: string;
    content: string;
    image: string;
    html: string;
    answer_type: number;
    extend_content: string;
    is_finish: number;
}

const renderedHtml = ref("");
const renderedExtendHtml = ref("");
const isYearBold = ref(false);
const spContentUseCalc = ref(false);
const spContentUseLightGame = ref(false);

const powerPoint = ref(0);
const powerPointCalcTime = ref(0);
const powerPointIncreaseRate = ref(0);

const timer = ref<NodeJS.Timer | null>();

let DestroyAction: (() => void)[] = [];

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    await loadPuzzleDetail();

    timer.value = setInterval(() => {
        getPowerPointDynamic();
    }, 30000);

    nextTick(() => {
        //init bs-tooltip
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => {
            return new Tooltip(tooltipTriggerEl);
        });
    });
});
onBeforeUnmount(() => {
    clearInterval(timer.value!);
    timer.value = null;

    DestroyAction.forEach((action) => {
        action();
    });
});

//onCreated {
globalBus.on("puzzle-reload", async () => {
    await loadPuzzleDetail();
});
//}


interface PuzzleDetailResponse extends BasicResponse {
    puzzle: PuzzleItem;
    power_point: number;
    power_point_calc_time: number;
    power_point_increase_rate: number;
    unlock_tip_cost: number;
    vote_type: number;
}

function getPowerPointDynamic() {
    globalStatus.powerPointDynamic = powerPoint.value + Math.floor((new Date().getTime() - powerPointCalcTime.value) / 60000) * powerPointIncreaseRate.value;
}

async function loadPuzzleDetail() {
    let year = parseInt(route.params.yn as string);

    let api = gConst.apiRoot + "/play/get-year-detail";
    let res = await fetchPostWithSign(api, {
        year
    });
    let data = await res.json() as PuzzleDetailResponse;

    if (data.status === 1) {
        if (data.puzzle) {
            Object.assign(puzzle, data.puzzle);

            if (puzzle.content.includes("<!--boldyear-->")) {
                isYearBold.value = true;
            }
            if (puzzle.content.includes("<!--use calc-->")) {
                spContentUseCalc.value = true;
            }
            if (puzzle.content.includes("<!--use lightgame-->")) {
                spContentUseLightGame.value = true;
            }

            if (puzzle.content) renderedHtml.value = marked(puzzle.content);
            if (puzzle.extend_content) renderedExtendHtml.value = marked(puzzle.extend_content);

            if (puzzle.type == 1) { //HTML
                let html = puzzle.html;
                puzzle.html = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
                    nextTick(() => {
                        let htmlContainer = document.getElementById("puzzleHtml");
                        if (!htmlContainer) return;
                        let ele = document.createElement("script");
                        ele.innerHTML = js;
                        htmlContainer.appendChild(ele);
                    });
                    return "";
                });
            }
        }
        powerPoint.value = data.power_point;
        powerPointCalcTime.value = data.power_point_calc_time;
        powerPointIncreaseRate.value = data.power_point_increase_rate;
        globalStatus.currentPuzzleVoteStatus = data.vote_type;
        getPowerPointDynamic();
    } else {
        defaultApiErrorAction(data);
    }
}

(window as any)["backendApi"] = async (path: string, req: object) => {
    let api = gConst.apiRoot + path;
    let res = await fetchPostWithSign(api, req);
    let data = await res.json();

    if (data["status"] == 1){
        return data;
    } else {
        defaultApiErrorAction(data);
    }
}
(window as any)["destroyAction"] = (action: () => void) => {
    DestroyAction.push(action);
}
</script>