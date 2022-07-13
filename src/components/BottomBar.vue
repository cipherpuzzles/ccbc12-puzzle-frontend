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
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><router-link class="nav-link" to="/main">返回时光机</router-link></li>
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><a class="nav-link" href="#" @click="showTip(yearId)">HINT</a></li>
                    <li class="nav-item" v-if="$route.path.indexOf('year') != -1"><a class="nav-link" href="#" @click="showAnswerHistory(yearId)">提交记录</a></li>
                </ul>
                <ul class="navbar-nav"  v-if="$route.path.indexOf('year') != -1">
                    <li class="nav-item vote-btn-icon-wrapper">
                        <button class="btn btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" 
                            data-bs-html="true" title="为此题目投票：<br>我喜欢这个题目<br>（队伍中每个人都可以进行不同的选择）"
                            @click="voteButtonClick(yearId, 'up')">
                            <VoteButton type="up" :status="globalStatus.currentPuzzleVoteStatus === 1 ? 'on' : 'off'"></VoteButton>
                        </button>
                    </li>
                    <li class="nav-item me-2 vote-btn-icon-wrapper">
                        <button class="btn btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" 
                            data-bs-html="true" title="为此题目投票：<br>我不喜欢这个题目<br>（队伍中每个人都可以进行不同的选择）"
                            @click="voteButtonClick(yearId, 'down')">
                            <VoteButton type="down" :status="globalStatus.currentPuzzleVoteStatus === 2 ? 'on' : 'off'"></VoteButton>
                        </button>
                    </li>
                    <form class="d-flex" @submit.prevent="sendAnswer(yearId)" data-bs-toggle="tooltip" data-bs-placement="top" :title="'回答错误将会 -' + waCost + ' 能量'">
                        <input class="form-control me-1 mb-2 mb-md-0 bg-light text-black answer-input" type="input" placeholder="Answer" aria-label="Answer" v-model="answer">
                        <li class="nav-item me-2"><button class="btn btn-primary answer-input-submit-button" type="submit">提交</button></li>
                    </form>
                </ul>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="puzzleTips" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="puzzleTipsDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header bg-info">
                    <h5 class="modal-title text-black" id="puzzleTipsDialogHeader">超时空信息网络运输器<span style="color: #087a91;">（HINT）</span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid mt-4 text-center" v-if="tipsStatus.is_tip_available === 0">
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" 
                                :aria-valuenow="tipsStatus.tip_available_progress" aria-valuemin="0" aria-valuemax="100" :style="{width: tipsStatus.tip_available_progress + '%'}"></div>
                        </div>
                        <div class="mt-4">正在分析平行宇宙特征，HINT 将于 {{ formatTimestamp(tipsStatus.tip_available_time) }} 可用。</div>
                    </div>
                    <div class="container-fluid mt-4" v-else>
                        <div class="text-info mb-4">
                            <div>在当前时间点运行 HINT 消耗的能量：{{tipsStatus.unlock_cost}} / 当前总能量： {{globalStatus.powerPointDynamic}} </div>
                        </div>
                        <hr/>
                        <div>
                            <h4>“锦囊”</h4>
                            <p class="text-secondary">从平行宇宙的历史数据中提取有关于此时的信息。</p>
                            <div v-for="tip in answerTips" :key="tip.tips_id" class="mb-4">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h5>#{{tip.tip_num}} &nbsp; {{tip.title}}
                                            <span class="badge bg-success" v-if="tip.is_open === 1">已解锁</span>
                                        </h5>
                                    </div>
                                    <div>
                                        <button v-if="tip.is_open == 0" class="btn btn-secondary" @click="unlockTip(yearId, tip.tip_num)">提取</button>
                                    </div>
                                </div>
                                <div v-html="tip.content_html"></div>
                            </div>
                            <div v-if="answerTips.length == 0" class="text-center">
                                <p>目前 HINT 无法为你分析到任何内容。这可能是其他平行宇宙中并未发生过类似的事件，过一段时间再回来查看可能会出现新的信息。</p>
                                <p>你仍然可以请求加强扫描“神谕”。</p>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <h4>“神谕”</h4>
                            <div class="d-flex justify-content-between">
                                <p class="text-secondary">对平行宇宙的加强扫描。填入当前的已知信息，在未来获取更有价值的信息。</p>
                                <button class="btn btn-secondary" @click="addOracleReq(yearId)">请求</button>
                            </div>
                            <div v-for="oracle in oracles" :key="oracle.oracle_id" class="mt-4 mb-4 d-flex justify-content-between">
                                <div>
                                    <span>Oracle #{{oracle.oracle_id}}</span>&nbsp;
                                    <span class="badge bg-success" v-if="oracle.is_reply === 1">已回复</span>
                                    <span class="badge bg-secondary" v-else>未回复</span>
                                </div>
                                <div>
                                    <span v-if="nowTimestamp < oracle.unlock_time">{{formatTimestamp(oracle.unlock_time)}} 可查看结果</span>&nbsp;
                                    <button v-if="oracle.is_reply === 1" class="btn btn-secondary" @click="openOracle(oracle.oracle_id)">查看</button>
                                    <button v-else class="btn btn-info" @click="openOracle(oracle.oracle_id)">编辑</button>
                                </div>
                            </div>
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
    <!--Oracle编辑对话框-->
    <div class="modal fade" id="oracleEditDialog" tabindex="-1" role="dialog" data-bs-backdrop="static" aria-labelledby="oracleEdit" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-xl">
            <div class="modal-content text-light bg-dark">
                <div class="modal-header bg-warning">
                    <h4 class="modal-title" id="oracleEdit" style="color: black;">Oracle #{{currentOracle?.oracle_id}}</h4>
                    <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid" v-if="currentOracle">
                        <div class="row">
                            <div class="col">
                                <h4>提交已知信息</h4>
                                <form @submit.prevent="editOracle">
                                    <div class="mb-3">
                                        <textarea class="form-control bg-dark text-light" rows="8" placeholder="使用Markdown书写要发送的内容。" v-model="currentOracle.question_content"></textarea>
                                    </div>
                                    <div class="mb-3 d-flex justify-content-between" v-if="currentOracle.is_reply === 0">
                                        <span class="text-secondary">在收到回复前可以不限次数的任意编辑已知信息。</span>
                                        <button type="submit" class="btn btn-primary">编辑</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="col">
                                <h4>收到的回复</h4>
                                <div class="text-center mt-4">
                                    <div class="alert alert-success" v-if="currentOracle.is_reply === 1 && nowTimestamp < currentOracle.unlock_time">已有回复，{{ formatTimestamp(currentOracle.unlock_time)}} 后可查看内容。</div>
                                    <div class="alert alert-warning" v-else-if="currentOracle.is_reply === 0 && nowTimestamp < currentOracle.unlock_time">还没有回复，最早 {{ formatTimestamp(currentOracle.unlock_time)}} 可查看内容。</div>
                                    <div class="alert alert-warning" v-else-if="currentOracle.is_reply === 0 && nowTimestamp >= currentOracle.unlock_time">还没有回复，有回复后可立即查看内容。</div>
                                </div>
                                <div class="mt-4" v-if="currentOracle.is_reply === 1">
                                    <div class="text-secondary">回复时间： {{ formatTimestamp(currentOracle.reply_time) }}</div>
                                    <div class="mt-2" v-html="currentOracle.reply_content_html"></div>
                                    <div class="mt-2" v-if="currentOracle.extend_function">
                                        <div class="text-info">在您查看神谕的同时，您可无需能量直接解锁提示 {{ currentOracle.extend_function_render }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>未选中 Oracle</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
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
.vote-btn-icon-wrapper {
    display: flex;
}
.btn-icon {
    height: 40px;
    width: 48px;
    &:hover {
        background-color: #3a3a3a;
    }
    &:active {
        background-color: #2f2f2f;
    }
    img {
        height: 25px;
        width: 25px;
    }
}
.answer-input {
    width: 286px;
    height: 40px;
}
.answer-input-submit-button {
    width: 77px;
    height: 40px;
}
</style>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import RoleBadge from './RoleBadge.vue';
import globalStatus from '../gstatus/status';
import useTipsPart from './parts/tips';
import useAnswerHistory from './parts/answerHistory';
import useCheckAnswer from './parts/checkAnswer';
import useMessage from './parts/message';
import usePuzzleVote from './parts/puzzleVote';
import { ppConfirmMessage } from './parts/ppConfirm';
import formatTimestamp from '../utils/formatDate';
import { computed, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

const nowTimestamp = computed(() => {
    return (new Date()).getTime();
});
const waCost = computed(() => {
    let year = parseInt(route.params.yn as string);
    if (year > 9900000) return 10;
    else return 5;
});
const yearId = computed(() => {
    if (route.path === "/last-year") return 9999999;
    else return parseInt(route.params.yn as string);
});

const { answerTips, oracles, tipsStatus, currentOracle, showTip, unlockTip, addOracleReq, openOracle, editOracle } = useTipsPart();
const { answerHistory, showAnswerHistory } = useAnswerHistory();
const { answer, sendAnswer } = useCheckAnswer(router);
const { unreadAnnouncement, unreadMessage, mailList, mailInfo, sendHeartbeat, showInbox, resetMail, reloadMail, sendMail } = useMessage();
const { VoteButton, voteButtonClick } = usePuzzleVote();

//onCreated
sendHeartbeat();

function checkBarStatus() {
    return localStorage.getItem('navbar-step') === "bar2nd-status";
}

</script>