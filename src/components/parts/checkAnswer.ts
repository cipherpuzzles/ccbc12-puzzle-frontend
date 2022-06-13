import { ref } from '@vue/reactivity';
import gConst from '../../gstatus/const';
import globalBus, { MessageType } from '../../gstatus/globalBus';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';

import type { Router } from 'vue-router';
import type { BasicResponse } from '../../utils/fetchPost';
interface CheckAnswerResponse extends BasicResponse {
    answer_status: number;
    extend_flag: number;
}

export default function useCheckAnswer(router: Router) {
    const answer = ref("");

    const sendAnswer = async (pid: number) => {
        let answerString = answer.value;
    
        if (answerString == null || answerString == ""){
            globalBus.emit("message", {
                type: "danger",
                message: "答案不能为空"
            });
            return;
        }
    
        if (!pid) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }
    
        let api = gConst.apiRoot + "/check-answer";
        let res = await fetchPostWithSign(api, {
            pid,
            answer: answerString
        });
        let data = await res.json() as CheckAnswerResponse;
    
        if (data.status == 1) {
            //final正确，跳转到结束页面
            if(data.answer_status == 1 && data.extend_flag == 1){
                globalBus.emit("message", {
                    type: "success",
                    message: "回答正确！"
                });
                router.push('/finalend');
                return;
            }
    
            let type: MessageType = "warning";
            if(data.answer_status == 1) type = "success";
            else if(data.answer_status == 2) type = "danger";
            else if(data.answer_status == 3) {
                type = "info";
            }
    
            globalBus.emit("show-message", {
                title: "答题结果",
                type,
                message: data.message
            });
    
            if(data.extend_flag == 16){
                globalBus.emit("reload");
            }
        } else {
            defaultApiErrorAction(data);
        }
    
    
        answer.value = "";
    }

    return {
        answer,
        sendAnswer
    }
}