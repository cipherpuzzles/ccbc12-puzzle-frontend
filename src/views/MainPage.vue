<template>
    <div class="container-md">
        <div class="row main-area-line">
            <div class="col">
                <div class="ratio ratio-bg main-area">
                    <div class="main-area-container">
                        <div class="main-area-header">
                            <div class="left-header-bar">
                                <button @click="showTipsContent">CCBC 12</button>
                            </div>
                            <div class="year-explorer-bar">
                                <input class="year-explorer-input" v-model="explorerYear" />
                            </div>
                            <div class="power-point-bar">
                                <div class="power-point-number">1200</div>
                            </div>
                        </div>
                        <div class="main-area-zone-list">
                            <div class="main-area-zone zone-activated">
                                <div class="puzzle-zone-top">
                                    <h5>时间线 A</h5>
                                    <div class="puzzle-button puzzle-button-finished">1709</div>
                                    <div class="puzzle-button puzzle-button-inactive">1727</div>
                                    <div class="puzzle-button puzzle-button-finished">1760</div>
                                    <div class="puzzle-button puzzle-button-finished">1780</div>
                                    <div class="puzzle-button puzzle-button-finished">1791</div>
                                    <div class="puzzle-button puzzle-button-finished">1796</div>
                                    <div class="puzzle-button puzzle-button-inactive">1853</div>
                                    <div class="puzzle-button puzzle-button-activated">1947</div>
                                    <div class="puzzle-button puzzle-button-activated">2024</div>
                                    <div class="puzzle-button puzzle-button-finished">2085</div>
                                </div>
                                <div class="puzzle-zone-meta">
                                    <div class="puzzle-button puzzle-meta-finished">终结点A</div>
                                </div>
                            </div>
                            <div class="main-area-zone zone-activated">
                                
                            </div>
                            <div class="main-area-zone zone-activated">
                                
                            </div>
                            <div class="main-area-zone zone-activated">
                                
                            </div>
                            <div class="main-area-zone zone-inactive">
                                
                            </div>
                            <div class="main-area-zone zone-inactive">
                                
                            </div>
                        </div>
                        <div class="main-area-meta-entrace">
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
                    <h4 class="modal-title" id="readTips">阅读信件</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" v-html="readTipsContent"></div>
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
            background-image: url('../assets/frame/input_year.svg');
            height: 65px;
            width: 213px;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                filter: brightness(1.1);
            }
            &:active {
                filter: brightness(0.9);
            }
            .year-explorer-input{
                font-weight: bold;
                font-size: 24px;
                line-height: 35px;
                background: transparent;
                border: 0;
                width: 90px;
                height: 35px;
                margin-top: 14px;
                margin-left: 75px;
                text-align: center;
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
            width: 129px;
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
    }
    .meta-clear {
        color: #32b491;
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
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import gConst from "../gstatus/const";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/fetchPost";
import { marked } from 'marked';
import type { BasicResponse } from '../utils/fetchPost';

const explorerYear = ref(2022);
const readTipsContent = ref('');

async function showTipsContent() {
    let api = gConst.apiRoot + "/play/get-main-help";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as BasicResponse;

    if (data.status == 1) {
        readTipsContent.value = marked(data.message);
    } else {
        defaultApiErrorAction(data);
    }

    const el = document.getElementById("readTipsDialog");
    if (!el) return;
    let modal = new Modal(el);
    modal.show();
}
</script>