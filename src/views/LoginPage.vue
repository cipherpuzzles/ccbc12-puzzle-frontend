<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { fetchPost, defaultApiErrorAction } from "../utils/fetchPost"
import gConst from "../gstatus/const"
import globalStatus from "../gstatus/status"

import type { BasicResponse } from '../utils/fetchPost';
interface LoginResponse extends BasicResponse {
    user_login_info?: UserLoginInfo;
    open_type: 0 | 1;
}
interface UserLoginInfo {
    uid: number;
    username: string;
    roleid: number;
    token: string;
    sk: string;
    etc: string;
}

const route = useRoute();
const router = useRouter();

const letter = ref(route.query?.letter);
if (!letter.value) {
    router.push('/');
} else {
    loginCheck(letter.value as string);
}

async function loginCheck(ticket: string) {
    let api = gConst.apiRoot + "/puzzle-check-ticket"
    let res = await fetchPost(api, {
        ticket
    });
    let data = await res.json() as LoginResponse;

    if (data.status == 1 && data.user_login_info) {
        globalStatus.isLogin = true;
        globalStatus.username = data.user_login_info.username;

        localStorage.setItem("uid", data.user_login_info.uid.toString());
        localStorage.setItem("username", data.user_login_info.username);
        localStorage.setItem("roleid", data.user_login_info.roleid.toString());
        localStorage.setItem("token", data.user_login_info.token);
        localStorage.setItem("sk", data.user_login_info.sk);
        localStorage.setItem("etc", data.user_login_info.etc);

        const navbarStep = localStorage.getItem("navbar-step");

        if (navbarStep === "bar2nd-status") {
            router.push('/main');
        } else if (navbarStep === "oo") {
            router.push('/puzzles');
        } else {
            router.push('/prologue');
        }
    } else {
        if (data.status == 2){
            router.push('/');
        }
        globalStatus.isLogin = false;
        defaultApiErrorAction(data);
    }
}
</script>