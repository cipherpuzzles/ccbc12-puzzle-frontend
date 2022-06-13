import { ref } from 'vue';
import gConst from '../../gstatus/const';
import globalBus from '../../gstatus/globalBus';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';
import { Modal } from 'bootstrap';
import formatTimestamp from '../../utils/formatDate';

import type { BasicResponse } from '../../utils/fetchPost';
interface AnswerLogResponse extends BasicResponse {
    answer_log: AnswerLogItem[];
}
interface AnswerLogItem {
    id: number;
    user_name: string;
    answer: string;
    status: number;
    create_time: number;
    dateString: string;
    statusLabel: string;
    rowClass: string;
}

export default function useAnswerHistory() {
    const answerHistory = ref<AnswerLogItem[]>([]);
    const showAnswerHistory = async (pid: number) => {
        if (!pid) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }
    
        let api = gConst.apiRoot + "/play/get-last-answer-log";
        let res = await fetchPostWithSign(api, {
            pid
        });
        let data = await res.json() as AnswerLogResponse;
    
        if (data.status == 1) {
            if (data.answer_log) {
                let answerLogList = [];
                for (let ah of data.answer_log) {
                    ah.dateString = formatTimestamp(ah.create_time);
                    
                    let statusLabel = "";
                    let rowClass = "";
                    if (ah.status == 1) { 
                        statusLabel = "OK";
                        rowClass = "table-success";
                    }
                    else if (ah.status == 2) {
                        statusLabel = "WRONG ANSWER";
                        rowClass = "table-danger";
                    }
                    else if (ah.status == 3) {
                        statusLabel = "COOL DOWN";
                        rowClass = "table-info";
                    }
                    else if (ah.status == 6) {
                        statusLabel = "HIT KEYWORD";
                        rowClass = "table-warning";
                    }
    
                    ah.statusLabel = statusLabel;
                    ah.rowClass = rowClass;
    
                    answerLogList.push(ah);
                }
    
                answerHistory.value = answerLogList;
    
                var answerHistoryDialog = new Modal(document.getElementById("answerHistory")!);
                answerHistoryDialog.show();
            }
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        answerHistory,
        showAnswerHistory
    }
}