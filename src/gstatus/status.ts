import { reactive } from "vue";

const status = reactive({
    isLogin: false,
    username: "[Loading...]",
    powerPointDynamic: 0,
    currentPuzzleVoteStatus: 0,
    tryAnswerCost: 50,
    tryMetaAnswerCost: 100,
});

export default status;