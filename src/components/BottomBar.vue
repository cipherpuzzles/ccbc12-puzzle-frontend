<template>
    <nav class="navbar navbar-expand-md fixed-bottom navbar-dark bg-dark">
        <div class="container-md">
            <a class="navbar-brand" href="#">{{globalStatus.username}}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 me-auto mb-md-0">
                    <li class="nav-item dropup">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            导航
                            <span class="badge bg-danger" v-if="(unreadAnnouncement + unreadMessage) > 0">{{ unreadAnnouncement + unreadMessage }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <template v-if="checkBarStatus()">
                                <li><router-link class="dropdown-item" to="/prologue">序章前言</router-link></li>
                                <li><router-link class="dropdown-item" to="/puzzles">序章题目</router-link></li>
                                <li><router-link class="dropdown-item" to="/preface">前言</router-link></li>
                                <li><router-link class="dropdown-item" to="/main">时光机</router-link></li>
                            </template>
                            <template v-else>
                                <li><router-link class="dropdown-item" to="/prologue">序章</router-link></li>
                                <li><router-link class="dropdown-item" to="/puzzles">题目</router-link></li>
                            </template>
                            <li><hr class="dropdown-divider"></li>
                            <li v-if="unreadMessage == 0"><a class="dropdown-item" href="#" @click="showInbox">站内信</a></li>
                            <li v-else class="bg-danger"><a class="dropdown-item" href="#" @click="showInbox">站内信 {{unreadMessage}} 条未读</a></li>
                            <li class="bg-danger" v-if="unreadAnnouncement > 0"><a class="dropdown-item" href="https://ccbc12.cipherpuzzles.com/announcement" target="_blank">新公告 {{ unreadAnnouncement }} 条未读</a></li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><a class="nav-link" href="#">返回时光机</a></li>
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><a class="nav-link" href="#" @click="showTip(parseInt($route.params.pid as string))">显示提示</a></li>
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><a class="nav-link" href="#" @click="showAnswerHistory(parseInt($route.params.pid as string))">答题记录</a></li>
                </ul>
                <ul class="navbar-nav"  v-if="$route.path.indexOf('year') != -1">
                    <form class="d-flex" @submit.prevent="sendAnswer(parseInt($route.params.pid as string))">
                        <input class="form-control me-2 mb-2 mb-md-0 bg-dark text-light" type="input" placeholder="Answer" aria-label="Answer" v-model="answer">
                    </form>
                    <li class="nav-item me-2"><button class="btn btn-outline-success" @click="sendAnswer(parseInt($route.params.pid as string))">提交</button></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="puzzleTips" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="puzzleTipsDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="puzzleTipsDialogHeader">提示</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-info mb-4">
                        能量点： {{powerPoint}}
                    </div>
                    <div class="container-fluid mt-4">
                        <div v-for="tip in answerTips" :key="tip.tips_id" class="mb-4">
                            <div class="d-flex justify-content-between">
                                <div><h5>提示{{tip.tip_num}}：{{tip.title}}
                                    <span class="badge bg-secondary" v-if="tip.is_open == 0">消耗 {{tip.cost}} 解锁</span>
                                    <span class="badge bg-success" v-else>已解锁</span>
                                </h5>
                                </div><div>
                                <button v-if="tip.is_open == 0" class="btn btn-secondary" @click="unlockTip(parseInt($route.params.pid as string), tip.tip_num)">解锁</button></div>
                            </div>
                            <div v-html="tip.content_html"></div>
                        </div>
                        <div v-if="answerTips.length == 0">
                            暂时没有提示，说不定过一段时间回来看看会有。
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="answerHistory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="answerHistoryDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="answerHistoryDialogHeader">答案记录</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-dark" v-if="answerHistory.length > 0">
                        <thead>
                            <tr>
                                <th scope="col">回答时间</th>
                                <th scope="col">回答者</th>
                                <th scope="col">答案</th>
                                <th scope="col">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ah in answerHistory" :key="ah.id" :class="[ ah.rowClass ]">
                                <td>{{ ah.dateString }}</td>
                                <td>{{ ah.user_name }}</td>
                                <td>{{ ah.answer }}</td>
                                <td>{{ ah.statusLabel }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else>还没有回答过这道题。</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="inbox" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="inboxDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="inboxDialogHeader">站内信</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <form @submit.prevent="sendMail">
                            <div class="mb-3">
                                <textarea class="form-control bg-dark text-light" rows="8" placeholder="使用Markdown书写要发送的内容。" v-model="mailInfo.newMail"></textarea>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary">发送</button>
                            </div>
                        </form>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <h3>消息记录：</h3>
                        <button class="btn btn-info btn-sm" @click="resetMail">刷新</button>
                    </div>
                    <div>
                        <div class="mail-tips" v-if="mailList.length == 0">没有消息</div>
                        <ul class="mail-history-list">
                            <li v-for="m in mailList" :key="m.mid">
                                <div class="mail-card">
                                    <div class="mail-header">
                                        <span>From: {{ m.user_name }}<role-badge :roleid="m.roleid"></role-badge></span>
                                        <span class="mail-time">{{ m.formatedDate }}</span>
                                        <span class="mail-read-marker" v-if="m.is_read == 0">[未读]</span>
                                    </div>
                                    <div class="mail-content" v-html="m.renderedHtml"></div>
                                </div>
                            </li>
                        </ul>
                        <div class="mail-tips load-next-button" v-if="!mailInfo.noMore && mailList.length > 0" @click="reloadMail">点击继续加载</div>
                        <div class="mail-tips" v-if="mailInfo.isLoading">加载中...</div>
                        <div class="mail-tips" v-if="mailInfo.noMore && mailList.length > 0">没有更多消息了</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <!--能量扣除确认对话框-->
    <div class="modal fade" id="ppConfirmDialog" tabindex="-1" role="dialog" data-bs-backdrop="static" aria-labelledby="ppconfirm" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content text-light bg-dark">
                <div class="modal-header bg-warning">
                    <h4 class="modal-title" id="ppconfirm" style="color: black;">能量消耗确认</h4>
                    <button type="button" class="btn-close" aria-label="Close" @click="ppConfirmMessage.confirm(false)"></button>
                </div>
                <div class="modal-body">
                    <div>{{ppConfirmMessage.message}}</div>
                    <div class="mt-5" style="text-align: center;">本次消耗：{{ppConfirmMessage.pp}}</div>
                    <div class="mt-2" style="text-align: center;">消耗后： {{globalStatus.powerPointDynamic}} ➔ {{globalStatus.powerPointDynamic - ppConfirmMessage.pp}}</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="ppConfirmMessage.confirm(true)">确认</button>
                    <button type="button" class="btn btn-secondary" @click="ppConfirmMessage.confirm(false)">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.mail-history-list{
    overflow: auto;
    padding-left: 0;
    li {
        list-style: none;
    }
}
.mail-card{
    margin-top: 20px;
    background-color: #4b4b4b;
    border-radius: 20px;
    .mail-header{
        border-bottom: 1px solid #999999;
        padding: 10px;
        font-size: 18px;
        .mail-time{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #999999;
        }
        .mail-read-marker{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #f15252;
        }
    }
    .mail-content{
        padding: 10px;
    }
}
.mail-tips{
    text-align: center;
    padding: 5px;
    background-color: #4b4b4b;
    border-radius: 10px;
}
.load-next-button{
    transition: all .2s linear;
    cursor: pointer;
}
.load-next-button:hover{
    background-color: #3a3a3a;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import RoleBadge from './RoleBadge.vue';

import globalStatus from '../gstatus/status';

import useTipsPart from './parts/tips';
import useAnswerHistory from './parts/answerHistory';
import useCheckAnswer from './parts/checkAnswer';
import useMessage from './parts/message';
import { ppConfirmMessage } from './parts/ppConfirm';

const router = useRouter();

const { answerTips, powerPoint, showTip, unlockTip, reloadTip } = useTipsPart();
const { answerHistory, showAnswerHistory } = useAnswerHistory();
const { answer, sendAnswer } = useCheckAnswer(router);
const { unreadAnnouncement, unreadMessage, mailList, mailInfo, sendHeartbeat, showInbox, resetMail, reloadMail, sendMail } = useMessage();

//onCreated
sendHeartbeat();

function checkBarStatus() {
    return localStorage.getItem('navbar-step') === "bar2nd-status";
}
</script>