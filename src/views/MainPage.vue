<template>
    <div class="container-md">
        <div class="row main-area-line">
            <div class="col">
                <div class="ratio ratio-bg main-area">
                    <div class="main-area-container">
                        <div class="main-area-header">
                            <div>CCBC 12</div>
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
                                    <div class="puzzle-button puzzle-button-finished">2085</div>
                                    <div class="puzzle-button puzzle-button-finished">2085</div>
                                </div>
                                <div class="puzzle-zone-meta">
                                    <div class="puzzle-button puzzle-meta-finished">交汇点A</div>
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
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

const explorerYear = ref(2022);
</script>