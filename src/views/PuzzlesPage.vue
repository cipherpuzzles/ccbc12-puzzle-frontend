<template>
    <div class="container-md">
        <div class="row header-line center">
            <div class="col">
                <div>CCBC 12</div>
                <div class="mt-5">
                    <h4 class="title-line"># {{ puzzleId }}</h4>
                </div>
            </div>
        </div>
        <div class="row puzzle-content-line">
            <div class="col">
                {{puzzleContent}}
            </div>
        </div>
        <div class="row center">
            <div class="col">
                <ProblemContent></ProblemContent>
            </div>
        </div>
        <div class="row answer-input-line center">
            <div class="col-lg-3">
                <div class="btn-group" role="group">
                    <button class="btn btn-lg btn-outline-primary" @click="showPuzzlesScoreboard">排行榜</button>
                    <button class="btn btn-lg btn-outline-primary" @click="showPuzzlesAnno">公 告</button>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="input-group input-group-lg">
                    <input v-model="answer" type="text" class="form-control" placeholder="填写答案" @keyup.enter="checkAnswer">
                    <button class="btn btn-lg btn-primary" type="button" @click="checkAnswer">提 交</button>
                </div>
            </div>
        </div>
    </div>
    <PuzzlesScoreboardDialog></PuzzlesScoreboardDialog>
    <PuzzlesAnnoDialog></PuzzlesAnnoDialog>
</template>

<style lang="scss" scoped>
.puzzle-content-line {
    margin-bottom: 40px;
}
.problem-content {
    font-size: 2.5em;
}
.problem-big {
    font-size: 6em;
}
.problem-symbol {
    font-family: 'ccbc12symbols';
    font-size: 8em;
}
.answer-input-line {
    margin-top: 300px;
    .input-group-lg {
        > input {
            height: 64px;
        }
        > button {
            height: 64px;
            width: 120px;
        }
    }
    .btn-group {
        width: 100%;
        > .btn {
            height: 64px;
            margin-bottom: 10px;
        }
    }
}
</style>

<style lang="scss">
.table-cell {
    .group-title{
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
    }
    .group-profile{
        color: #999999;
        word-break: break-all;
        height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.personal-badge {
    background-color: #888888;
    display: inline-block;
    position: absolute;
    font-size: 10px;
    color: #FFFFFF;
    padding: 2px 5px 2px 5px;
    border-radius: 5px;
    margin-left: 5px;
    font-weight: bold;
}
.anno-card {
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
    min-height: 200px;
    background-color: #555555;
}
.anno-card-time {
    color: #8a8a8a;
    text-align: right;
}
</style>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import usePuzzlesScoreboard from '../components/puzzlesParts/puzzlesScoreboard';
import usePuzzlesAnno from '../components/puzzlesParts/puzzlesAnno';
import gConst from '../gstatus/const';
import globalBus from '../gstatus/globalBus';
import { BasicResponse, defaultApiErrorAction, fetchPostWithSign } from '../utils/fetchPost';
import isLogin from '../utils/isLogin';

const router = useRouter();
const { PuzzlesScoreboardDialog, showPuzzlesScoreboard } = usePuzzlesScoreboard();
const { PuzzlesAnnoDialog, showPuzzlesAnno } = usePuzzlesAnno();

const puzzleContent = ref('');
const content = ref('');
const usedAssets = ref(0);
const puzzleId = ref(0);
const ProblemContent = () => {
    if (usedAssets.value === 1) {
        //放大显示
        return <div class="problem-content problem-big">{ content.value }</div>;
    } else if (usedAssets.value === 2) {
        return <div class="problem-content problem-symbol">{ content.value }</div>;
    }
    
    return <div class="problem-content">{ content.value }</div>;
}

const answer = ref('');

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    await reloadPuzzleDetail();
});

interface PuzzlesPageGetPuzzleDetailResponse extends BasicResponse {
    puzzle_id: number;
    problem_content: string;
    used_replaced_assets: number;
    content: string;
}

async function reloadPuzzleDetail() {
    let api = gConst.apiRoot + "/play/get-puzzle-detail";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json() as PuzzlesPageGetPuzzleDetailResponse;

    if (data.status == 1) {
        puzzleId.value = data.puzzle_id;
        content.value = data.problem_content;
        usedAssets.value = data.used_replaced_assets;
        puzzleContent.value = data.content;
    } else {
        defaultApiErrorAction(data);
    }
}

interface PuzzlesPageCheckAnswerResponse extends BasicResponse {
    /**
     * 答案状态（1-正确 2-答案错误 5-发生存档错误而未判定 6-发生跳转）
     */
    answer_status: number;
    /**
     * 跳转状态（0-什么都不做 1-跳转到正式序章 4-跳转到单人剧情结局）
     */
    extend_flag: number;
    cooldown_remain_seconds: number;
}

async function checkAnswer() {
    let answerString = answer.value;

    if (answerString == null || answerString == "") {
        globalBus.emit("message", {
            type: "danger",
            message: "答案不能为空"
        });
        return;
    }

    let api = gConst.apiRoot + "/play/check-puzzle-answer";
    let res = await fetchPostWithSign(api, {
        pid: puzzleId.value,
        answer: answerString
    });
    let data = await res.json() as PuzzlesPageCheckAnswerResponse;

    if (data.status == 1) {
        //meta正确，跳转
        if (data.answer_status === 1 && data.extend_flag === 1) {
            globalBus.emit("message", {
                type: "success",
                message: "答案正确"
            });
            router.push('/preface');
            return;
        } else if (data.answer_status === 1 && data.extend_flag === 4) {
            globalBus.emit("show-message", {
                title: "答案正确",
                type: "success",
                message: data.message
            });
            router.push('/');
            return;
        }

        let type: "warning" | "success" | "danger" = "warning";
        if (data.answer_status === 1) {
            type = "success";
        } else if (data.answer_status === 2) {
            type = "danger";
        }

        globalBus.emit("show-message", {
            title: "答题结果",
            type: type,
            message: data.message
        });

        if (data.answer_status === 1) {
            globalBus.emit("reload");
        }
    } else {
        defaultApiErrorAction(data);
    }

    answer.value = '';
}
</script>