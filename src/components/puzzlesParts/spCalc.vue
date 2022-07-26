<template>
    <div class="calc-warpper">
        <div class="error-light-area">
            <div class="error-light" :class="[ context.error === 1 ? 'light-on' : '']"></div>
            <div class="error-light" :class="[ context.error === 2 ? 'light-on' : '']"></div>
            <div class="error-light" :class="[ context.error === 3 ? 'light-on' : '']"></div>
            <div class="error-light" :class="[ context.error === 4 ? 'light-on' : '']"></div>
            <div class="error-light" :class="[ context.error === 5 ? 'light-on' : '']"></div>
        </div>
        <div class="status-light-area">
            <div class="status-light" :class="[ context.buffer.length >= 1 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 2 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 3 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 4 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 5 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 6 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 7 ? 'light-on' : '']"></div>
            <div class="status-light" :class="[ context.buffer.length >= 8 ? 'light-on' : '']"></div>
        </div>
        <div class="calc-screen">
            <div class="calc-screen-content" v-if="context.error === 0">
                {{ context.screen }}
            </div>
            <div class="calc-screen-content error-text" v-else>?!</div>
        </div>
        <div class="calc-logo">
            <img :src="logoSvg" height="45"/>
        </div>
        <div class="calc-buttons-area">
            <div class="calc-button" @click="CalcButton('B')">B</div>
            <div class="calc-button" @click="CalcButton('C')">C</div>
            <div class="calc-button" @click="CalcButton('D')">D</div>
            <div class="calc-button" @click="CalcButton('E')">E</div>
            <div class="calc-button" @click="CalcButton('F')">F</div>
            <div class="calc-button" @click="CalcButton('G')">G</div>
            <div class="calc-button calc-button-ac" @click="CalcButton('\r')">.</div>
            <div class="calc-button" @click="CalcButton('6')">6</div>
            <div class="calc-button" @click="CalcButton('7')">7</div>
            <div class="calc-button" @click="CalcButton('8')">8</div>
            <div class="calc-button" @click="CalcButton('9')">9</div>
            <div class="calc-button" @click="CalcButton('A')">A</div>
            <div class="calc-button" @click="CalcButton('*')">*</div>
            <div class="calc-button" @click="CalcButton('+')">+</div>
            <div class="calc-button" @click="CalcButton('1')">1</div>
            <div class="calc-button" @click="CalcButton('2')">2</div>
            <div class="calc-button" @click="CalcButton('3')">3</div>
            <div class="calc-button" @click="CalcButton('4')">4</div>
            <div class="calc-button" @click="CalcButton('5')">5</div>
            <div class="calc-button calc-button-broken">/</div>
            <div class="calc-button" @click="CalcButton('-')">-</div>
            <div class="calc-button" @click="CalcButton('~')">~</div>
            <div class="calc-button calc-button-space" @click="CalcButton(' ')"> </div>
            <div class="calc-button calc-button-broken">0</div>
            <div class="calc-button" @click="CalcButton('%')">%</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.calc-warpper{
    width: 720px;
    height: 400px;
    background-color: #4a4a4a;
    box-shadow: 0 0 10px #000000;
    border-radius: 5px;
    border-bottom: 1px solid #000000;
    border-right: 1px solid #000000;
    border-left: 1px solid #cccccc;
    border-top: 1px solid #cccccc;
    position: relative;
}
.status-light-area {
    position: absolute;
    top: 22px;
    left: 686px;
    width: 22px;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .status-light {
        height: 7px;
        width: 22px;
        background-color: #000000;
        border-radius: 1px;
        border-bottom: 1px solid #000000;
        border-right: 1px solid #000000;
        border-left: 1px solid #6b6b6b; 
        border-top: 1px solid #9b9b9b;
        transition: all 0.5s ease-in-out;
    }
    .light-on {
        background: radial-gradient(ellipse 22px 7px, #49d819, #051c02);
    }
}
.error-light-area {
    position: absolute;
    top: 22px;
    left: 12px;
    width: 22px;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .error-light {
        height: 7px;
        width: 22px;
        background-color: #000000;
        border-radius: 1px;
        border-bottom: 1px solid #000000;
        border-right: 1px solid #000000;
        border-left: 1px solid #6b6b6b; 
        border-top: 1px solid #9b9b9b;
        transition: all 0.5s ease-in-out;
    }
    .light-on {
        background: radial-gradient(ellipse 22px 7px, #dc3222, #051c02);
    }
}
.calc-screen {
    position: absolute;
    width: 628px;
    height: 72px;
    background-color: rgb(158, 173, 168);
    top: 22px;
    left: 46px;
    border-top: 2px solid #000000;
    border-left: 2px solid #000000;
    border-right: 2px solid #cccccc;
    border-bottom: 2px solid #cccccc;
    .calc-screen-content {
        position: absolute;
        font-family: 'ccbc12symbols';
        width: 100%;
        height: 100%;
        padding-right: 8px;
        text-align: right;
        line-height: 72px;
        font-size: 48px;
        color: #000000;
        z-index: 2;
        &::selection {
            background: rgba(255, 47, 109, 0.6);
        }
    }
    .error-text {
        color: #dc3222;
    }
}
.calc-logo {
    position: absolute;
    top: 341px;
    left: 625px;
    user-select: none;
}
.calc-buttons-area {
    position: absolute;
    width: 700px;
    height: 270px;
    top: 115px;
    left: 10px;
    display: flex;
    flex-wrap: wrap;
    .calc-button {
        width: 90px;
        height: 60px;
        border-left: 2px solid #cccccc;
        border-top: 2px solid #cccccc;
        border-right: 2px solid #000000;
        border-bottom: 2px solid #000000;
        margin-right: 10px;
        margin-top: 10px;
        border-radius: 11px;
        cursor: pointer;
        font-family: 'ccbc12symbols';
        font-size: 42px;
        text-align: center;
        line-height: 60px;
        user-select: none;
        transition: all 0.1s ease-in-out;
        &:hover {
            background-color: #5e5e5e;
        }
        &:active {
            border-left: 2px solid #000000;
            border-top: 2px solid #000000;
            border-right: 2px solid #cccccc;
            border-bottom: 2px solid #cccccc;
        }
    }
    .calc-button-space {
        width: 290px;
    }
    .calc-button-ac {
        background-color: #871d14;
    }
    .calc-button-broken {
        background-color: #3b3b3b;
        transform: rotate(2deg);
        border-left: 2px solid #000000;
        border-top: 2px solid #000000;
        border-right: 2px solid #cccccc;
        border-bottom: 2px solid #cccccc;
        &:hover {
            background-color: #3b3b3b;
        }
    }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import logoSvg from '../../assets/logo.svg';
import gConst from '../../gstatus/const';
import { BasicResponse, defaultApiErrorAction, fetchPostWithSign } from '../../utils/fetchPost';

interface PartNumber {
    type: number;
    content: string;
}

interface CalcContext {
    screen: string;
    input_buffer: string;
    buffer: PartNumber[];
    error: number;
}

interface CalcResponse extends BasicResponse {
    context: CalcContext;
}

const context = ref<CalcContext>({
    screen: '',
    input_buffer: '',
    buffer: [],
    error: 0
});

async function CalcButton(input: string) {
    let api = gConst.apiRoot + "/puzzle-backend/calc";
    let res = await fetchPostWithSign(api, {
        current_input: input,
        context: context.value
    });
    let data = await res.json() as CalcResponse;

    if (data.status === 1) {
        context.value = data.context;
    } else {
        defaultApiErrorAction(data);
    }
}
</script>
