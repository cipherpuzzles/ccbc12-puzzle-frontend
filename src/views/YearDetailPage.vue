<template>
    <div class="container-md">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 12</div>
                <h4 class="title-line">
                    <span :class="[isYearBold ? 'title-line-bold-year' : '']">{{ puzzle.second_key }}</span>
                    <span class="title-line-title">{{ puzzle.title }}</span>
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
    margin-left: 2rem;
}
</style>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import isLogin from '../utils/isLogin'
import { useRoute, useRouter } from "vue-router";
import gConst from '../gstatus/const';
import { defaultApiErrorAction, fetchPostWithSign } from '../utils/fetchPost';
import { marked } from 'marked'

const route = useRoute();
const router = useRouter();

const puzzle = reactive({
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
const renderedHtml = ref("");
const renderedExtendHtml = ref("");
const isYearBold = ref(false);

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    await loadPuzzleDetail();
});

async function loadPuzzleDetail() {
    let year = parseInt(route.params.yn as string);

    let api = gConst.apiRoot + "/play/get-year-detail";
    let res = await fetchPostWithSign(api, {
        year
    });
    let data = await res.json();

    if (data.status === 1) {
        if (data.puzzle) {
            Object.assign(puzzle, data.puzzle);

            if (puzzle.content.includes("<!--boldyear-->")) {
                isYearBold.value = true;
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
    } else {
        defaultApiErrorAction(data);
    }
}

(<any>window)["backendApi"] = async (path: string, req: object) => {
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