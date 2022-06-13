import { reactive } from "vue";

const status = reactive({
    isLogin: false,
    username: "[][Loading...]",
});

export default status;