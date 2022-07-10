import { reactive } from "vue";

const status = reactive({
    isLogin: false,
    username: "[][Loading...]",
    powerPointDynamic: 0,
    currentPuzzleVoteStatus: 0,
});

export default status;