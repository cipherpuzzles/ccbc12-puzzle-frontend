<template>
    <div class="container-md">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 12</div>
                <h4 class="title-line">
                    <span>{{ puzzle.title }}</span>
                </h4>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-html="renderedHtml"></div>
            </div>
        </div>
        <div class="row" v-if="puzzle.html">
            <div class="col">
                <div v-html="renderPart1" id="puzzleHtml"></div>
            </div>
        </div>
        <div class="row" v-if="puzzle.image">
            <div class="col">
                <div v-html="renderPart2" id="puzzleHtml2"></div>
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

const renderPart1 = ref("");
const renderPart2 = ref("");

const powerPoint = ref(0);
const powerPointCalcTime = ref(0);
const powerPointIncreaseRate = ref(0);

const timer = ref<NodeJS.Timer | null>();

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }
    if (localStorage.getItem("metaUnlock") !== "1") {
        router.push('/');
        return;
    }

    await loadPuzzleDetail();

    timer.value = setInterval(() => {
        getPowerPointDynamic();
    }, 30000);

    nextTick(() => {
        //init bs-tooltip
        let tooltipTriggerList = ([]).slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => {
            return new Tooltip(tooltipTriggerEl);
        });
    });
});
onBeforeUnmount(() => {
    clearInterval(timer.value!);
    timer.value = null;

    //hide answer tooltip
    console.log("destroy tooltip");
    let tooltipContainerElList: any[] = ([]).slice.call(document.querySelectorAll('.tooltip'));
    //remove show class from each tooltip
    tooltipContainerElList.map((tooltipContainerEl) => {
        tooltipContainerEl.classList.remove('show');
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

    let api = gConst.apiRoot + "/play/get-meta-detail";
    let res = await fetchPostWithSign(api, {
        year
    });
    let data = await res.json() as PuzzleDetailResponse;

    if (data.status === 1) {
        if (data.puzzle) {
            Object.assign(puzzle, data.puzzle);

            if (puzzle.content) renderedHtml.value = marked(puzzle.content);
            if (puzzle.extend_content) renderedExtendHtml.value = marked(puzzle.extend_content);

            if (puzzle.html) { //HTML
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
                renderPart1.value = marked(puzzle.html);
            }
            if (puzzle.image) {
                let html = puzzle.image;
                puzzle.image = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
                    nextTick(() => {
                        let htmlContainer = document.getElementById("puzzleHtml2");
                        if (!htmlContainer) return;
                        let ele = document.createElement("script");
                        ele.innerHTML = js;
                        htmlContainer.appendChild(ele);
                    });
                    return "";
                });
                renderPart2.value = marked(puzzle.image);
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
</script>