<template>
    <div class="container-md">
        <div class="row main-area-line">
            <div class="col">
                <div class="ratio ratio-bg main-area">
                    <div class="main-area-container">
                        <div class="main-area-header">
                            <div class="left-header-bar">
                                <button class="left-header-button button-group-start" @click="showTipsContent" data-bs-toggle="tooltip" data-bs-placement="bottom" title="阅读说明信件">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                                </button>
                                <button class="left-header-button button-group-middle" @click="showExplorerdYearHistory" data-bs-toggle="tooltip" data-bs-placement="bottom" title="显示已探测年份列表">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                                    </svg>
                                </button>
                                <button class="left-header-button button-group-end" @click="showPuzzleStat" data-bs-toggle="tooltip" data-bs-placement="bottom" title="查看平行世界时间线">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
                                        <path d="M0 0h24v24H0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="year-explorer-bar" @click="sendYearProbe">
                                <div class="dropdown">
                                    <input class="year-explorer-input" v-model="explorerYear" data-bs-toggle="dropdown" @keyup.enter="sendYearProbe"/>
                                    <ul class="dropdown-menu">
                                        <li v-for="year in yearSelectionList" :key="'ys-' + year"><a class="dropdown-item" href="javascript:;" @click="explorerYear = year">{{year}}</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="power-point-bar" data-bs-toggle="tooltip" data-bs-placement="bottom" :title="'当前能量增速：' + powerPointIncreaseRate + ' /min'">
                                <div class="power-point-number">{{ globalStatus.powerPointDynamic }}</div>
                            </div>
                        </div>
                        <div class="main-area-zone-list">
                            <div v-for="yearList in yearListData" :key="yearList.pgid" class="main-area-zone" 
                                :class="[ getAreaBackgroundClass(yearList) ]">
                                <div class="puzzle-zone-top" v-if="yearList.puzzles && yearList.puzzles.length > 0">
                                    <h5>{{yearList.group_name}}</h5>
                                    <div v-for="puzzleItem in yearList.puzzles" :key="puzzleItem.year" class="puzzle-button" :class="[getPuzzleTypeClass(puzzleItem)]" 
                                        @click="doPuzzleButton(puzzleItem, yearList)">{{puzzleItem.year}}</div>
                                </div>
                                <div class="puzzle-zone-meta" v-if="yearList.meta_type !== 0">
                                    <div class="puzzle-button" :class="[getPuzzleMetaTypeClass(yearList.meta_type)]">{{yearList.meta_name}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="main-area-meta-entrace" :class="[(finalMetaType === 2 ? 'meta-clear' : '')]" v-if="finalMetaType !== 0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--操作提示对话框-->
        <div class="modal fade" id="readTipsDialog" tabindex="-1" role="dialog" aria-labelledby="readTips" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
                <div class="modal-content text-light bg-dark">
                    <div class="modal-header bg-info">
                        <h4 class="modal-title" id="readTips" style="color: black;">阅读信件</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-html="readTipsContent"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!--探测结果对话框-->
        <div class="modal fade" id="probeResultDialog" tabindex="-1" role="dialog" aria-labelledby="probeResult" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
                <div class="modal-content text-light bg-dark">
                    <div class="modal-header bg-info">
                        <h4 class="modal-title" id="probeResult" style="color: black;">探测结果</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div v-if="yearProbeMessage" class="alert alert-secondary" role="alert">{{yearProbeMessage}}</div>
                        <div v-if="yearProbeResult" v-html="yearProbeResult"></div>
                        <div v-else style="color: #999999; text-align: center;">什么都没探测到</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
        <!--探测年份列表对话框-->
        <div class="modal fade" id="probedYearListDialog" tabindex="-1" role="dialog" aria-labelledby="probedList" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
                <div class="modal-content text-light bg-dark">
                    <div class="modal-header bg-info">
                        <h4 class="modal-title" id="probedList" style="color: black;">已探测的年份</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>此处列出所有已探测的年份，包括主动探测和自动探测。存在时间奇点的年份使用浅灰色底色标出。</div>
                        <div class="probed-year-list-wrapper">
                            <div v-for="probedYear in probedYearList" :key="'es=' + probedYear.year" class="probed-year-item" :class="[probedYear.is_puzzle ? 'probed-year-puzzle' : '']">{{probedYear.year}}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-area-line{
    margin-top: 65px;
}
.main-area {
    background-image: url('../assets/frame/bg.svg');
}
.ratio-bg {
    --bs-aspect-ratio: calc(768 / 1297 * 100%);
}
.main-area-container{
    .main-area-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 100px;
        padding-left: 135px;
        padding-right: 135px;
        .year-explorer-bar {
            background-image: url('../assets/frame/year_input.svg');
            height: 66px;
            width: 202px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                filter: brightness(1.1);
            }
            &:active {
                filter: brightness(0.9);
            }
            .year-explorer-input {
                border: 0;
                font-weight: bold;
                font-size: 24px;
                line-height: 35px;
                background: transparent;
                width: 88px;
                height: 35px;
                margin-top: 14px;
                margin-left: 58px;
                text-align: center;
            }
            .dropdown-menu {
                width: 92px;
                min-width: auto !important;
                height: 450px;
                overflow-y: auto;
            }
        }
        .power-point-bar {
            background-image: url('../assets/frame/energy_points.svg');
            height: 41px;
            width: 129px;
            .power-point-number{
                color: black;
                font-weight: bold;
                text-align: right;
                padding-right: 3px;
                line-height: 28px;
                margin-right: 9px;
                margin-top: 5px;
                margin-left: 34px;
                margin-bottom: 5px;
            }
        }
        .left-header-bar{
            display: flex;
            width: 129px;
            .left-header-button {
                border: 2px #000000 solid;
                background-color: #3f3f3f;
                height: 40px;
                width: 40px;
                color: white;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 0.15s ease-in-out;
                &:hover {
                    filter: brightness(1.1);
                }
                &:active {
                    filter: brightness(0.9);
                }
            }
            .button-group-start {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                border-right: 1px rgb(86,86,86) solid;
            }
            .button-group-middle {
                border-right: 1px rgb(86,86,86) solid;
            }
            .button-group-end {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }
    .main-area-zone-list {
        display: flex;
        justify-content: space-between;
        margin-top: 45px;
        padding-left: 135px;
        padding-right: 135px;
        .main-area-zone {
            width: 157px;
            height: 541px;
            transition: all 0.2s ease-in-out;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            padding-bottom: 20px;
        }
        .zone-activated {
            background-image: url('../assets/frame/bg_area_activated.svg');
        }
        .zone-inactive {
            background-image: url('../assets/frame/bg_area_inactive.svg');
        }
        .puzzle-zone-top {
            text-align: center;
            h5 {
                font-size: 16px;
                font-weight: bold;
            }
        }
        .puzzle-zone-meta {
            text-align: center;
        }
        .puzzle-button {
            width: 123px;
            height: 33px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            color: black;
            font-weight: bold;
            font-size: 16px;
            line-height: 33px;
            &:hover {
                filter: brightness(1.1);
            }
            &:active {
                filter: brightness(0.9);
            }
            + .puzzle-button{
                margin-top: 2px;
            }
        }
        .puzzle-button-inactive {
            color: #343434;
            background-image: url('../assets/frame/button_inactive.svg');
        }
        .puzzle-button-activated {
            background-image: url('../assets/frame/button_activated.svg');
        }
        .puzzle-button-finished {
            background-image: url('../assets/frame/button_finished.svg');
        }
        .puzzle-meta-activated {
            color: white;
            -webkit-text-stroke: 1px rgba(0, 0, 0, 0.486);
            background-image: url('../assets/frame/button_meta.svg');
        }
        .puzzle-meta-finished {
            color: white;
            -webkit-text-stroke: 1px rgba(0, 0, 0, 0.486);
            background-image: url('../assets/frame/button_meta_finished.svg');
        }
    }
    .main-area-meta-entrace {
        cursor: pointer;
        color: #afafaf;
        animation: bounce-up-down 3s ease-in-out infinite;
        text-align: center;
        margin-top: 15px;
        transition: all 0.15s ease-in-out;
        &:hover {
            filter: brightness(1.2);
            animation: none;
        }
        &:active {
            filter: brightness(0.8);
        }
    }
    .meta-clear {
        color: #32b491;
    }
}
.probed-year-list-wrapper {
    display: flex;
    flex-wrap: wrap;
    .probed-year-item {
        height: 60px;
        width: 150px;
        text-align: center;
        font-weight: bold;
        line-height: 60px;
    }
    .probed-year-puzzle {
        background-color: #afafaf;
        color: black;
    }
}
@keyframes bounce-up-down {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0);
    }
}
</style>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { Modal, Tooltip } from 'bootstrap';
import gConst from "../gstatus/const";
import globalStatus from '../gstatus/status';
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/fetchPost";
import { powerPointConfirm } from '../components/parts/ppConfirm';
import { marked } from 'marked';
import { useRouter } from "vue-router";
import type { BasicResponse } from '../utils/fetchPost';

const router = useRouter();

const explorerYear = ref(2022);
const readTipsContent = ref('');
const timer = ref<NodeJS.Timer | null>();
onMounted(async () => {
    await loadDetail();
    if (localStorage.getItem('readMainHelp') !== "1") {
        await showTipsContent();
    }
    timer.value = setInterval(() => {
        getPowerPointDynamic();
    }, 30000);

    //init bs-tooltip
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => {
        return new Tooltip(tooltipTriggerEl)
    })
});
onBeforeUnmount(() => {
    clearInterval(timer.value!);
    timer.value = null;
});

async function showTipsContent() {
    let api = gConst.apiRoot + "/play/get-main-help";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as BasicResponse;

    if (data.status == 1) {
        readTipsContent.value = marked(data.message);
    } else {
        defaultApiErrorAction(data);
    }

    nextTick(() => {
        const el = document.getElementById("readTipsDialog");
        if (!el) return;
        let modal = new Modal(el);
        modal.show();
        localStorage.setItem('readMainHelp', '1');
    });
}

interface GetYearListResponse extends BasicResponse {
    data: SimplePuzzleGroup[];
    final_meta_type: number;
    power_point: number;
    power_point_calc_time: number;
    power_point_increase_rate: number;
    time_probe_cost: number;
}

interface SimplePuzzleGroup {
    pgid: number;
    group_name: string;
    puzzles: SimplePuzzle[];
    meta_type: number;
    meta_name: string;
    unlock_cost: number;
}

interface SimplePuzzle {
    year: number;
    type: number;
}

const yearListData = ref<SimplePuzzleGroup[]>([]);
const finalMetaType = ref(0);
const powerPoint = ref(0);
const powerPointCalcTime = ref(0);
const powerPointIncreaseRate = ref(0);
const timeProbeCost = ref(0);

function getPowerPointDynamic() {
    globalStatus.powerPointDynamic = powerPoint.value + Math.floor((new Date().getTime() - powerPointCalcTime.value) / 60000) * powerPointIncreaseRate.value;
    console.log("update power point dynamic", globalStatus.powerPointDynamic);
}

async function loadDetail() {
    let api = gConst.apiRoot + "/play/get-year-list";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as GetYearListResponse;

    if (data.status == 1) {
        yearListData.value = data.data;
        finalMetaType.value = data.final_meta_type;
        powerPoint.value = data.power_point;
        powerPointCalcTime.value = data.power_point_calc_time;
        powerPointIncreaseRate.value = data.power_point_increase_rate;
        timeProbeCost.value = data.time_probe_cost;
        getPowerPointDynamic();
    } else {
        defaultApiErrorAction(data);
    }
}

const getAreaBackgroundClass = (spg: SimplePuzzleGroup) => {
    if (spg.puzzles && spg.puzzles.length > 0) {
        return "zone-activated";
    } else {
        return "zone-inactive";
    }
}
const getPuzzleTypeClass = (sp: SimplePuzzle) => {
    if (sp.type === 2) return "puzzle-button-finished";
    else if (sp.type === 1) return "puzzle-button-activated";
    else return "puzzle-button-inactive";
}
const getPuzzleMetaTypeClass = (meta_type: number) => {
    if (meta_type === 2) return "puzzle-meta-finished";
    else if (meta_type === 1) return "puzzle-meta-activated";
    else return "";
}

const yearSelectionList = ref<number[]>([...Array.from({length: 400}).map((a, i) => i + 1701)]);

interface ProbedYear {
    year: number;
    is_puzzle: number;
}
interface GetProbedYearListResponse extends BasicResponse {
    data: ProbedYear[];
}
const probedYearList = ref<ProbedYear[]>([]);

async function showExplorerdYearHistory() {
    let api = gConst.apiRoot + "/play/get-probed-year";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as GetProbedYearListResponse;

    if (data.status == 1) {
        probedYearList.value = data.data;

        nextTick(async () => {
            const el = document.getElementById("probedYearListDialog");
            if (!el) return;
            let modal = new Modal(el);
            modal.show();
        });
    } else {
        defaultApiErrorAction(data);
    }
}

async function showPuzzleStat() {

}

interface YearProbeResponse extends BasicResponse {
    extra_message: string;
}
const yearProbeResult = ref('');
const yearProbeMessage = ref('');
async function sendYearProbe(e: Event) {
    if (e && e.target && e.type === "click") {
        let targetEl = e.target as Element;
        if (targetEl.tagName === "INPUT") return;
    }

    let result = await powerPointConfirm(`正在准备探测 ${explorerYear.value} 年。探测将会消耗能量，确定要探测吗？`, timeProbeCost.value);
    if (!result) return;

    let api = gConst.apiRoot + "/play/probe-year";
    let res = await fetchPostWithSign(api, {year: explorerYear.value});
    let data = await res.json() as YearProbeResponse;

    if (data.status == 1) {
        yearProbeResult.value = marked(data.message);
        yearProbeMessage.value = data.extra_message;

        nextTick(async () => {
            const el = document.getElementById("probeResultDialog");
            if (!el) return;
            let modal = new Modal(el);
            modal.show();

            await loadDetail();
        });
    } else {
        defaultApiErrorAction(data);
    }
}

async function doPuzzleButton(puzzleItem: SimplePuzzle, yearList: SimplePuzzleGroup) {
    if (puzzleItem.type === 0) {
        //未解锁
        let unlockResult = await powerPointConfirm(`正在准备详细扫描位于 ${puzzleItem.year} 年的时间奇点，确定要扫描吗？注意：一旦你成功扭转时间奇点，扫描时消耗的能量将会返还。`, yearList.unlock_cost);
        if (!unlockResult) return;

        //解锁
        let api = gConst.apiRoot + "/play/unlock-puzzle";
        let res = await fetchPostWithSign(api, {
            year: puzzleItem.year
        });
        let data = await res.json() as BasicResponse;

        if (data.status == 1) {
            nextTick(async () => {
                await loadDetail();
            });
        } else {
            defaultApiErrorAction(data);
        }
        return;
    }

    //已解锁，直接跳转到详细页面
    router.push(`/year/${puzzleItem.year}`);
}
</script>