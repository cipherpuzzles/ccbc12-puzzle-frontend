import { ref } from 'vue';
import globalBus from '../../gstatus/globalBus';
import gConst from '../../gstatus/const';
import { Modal } from 'bootstrap';
import { marked } from 'marked';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';

import type { BasicResponse } from '../../utils/fetchPost';
interface GetTipsResponse extends BasicResponse {
    puzzle_tips: answerTipItem[];
    power_point: number;
}
export interface answerTipItem {
    tips_id: number,
    tip_num: number,
    is_open: number,
    cost: number,
    title: string,
    content: string,
    content_html: string
}

export default function useTipsPart() {
    const answerTips = ref<answerTipItem[]>([]);
    const powerPoint = ref(0);

    const showTip = async (pid: number) => {
        if (!pid) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }
    
        await reloadTip(pid);

        let tipEl = document.getElementById("puzzleTips");
        if (!tipEl) return;
    
        var tipDialog = new Modal(tipEl);
        tipDialog.show();
    }

    const unlockTip = async (pid: number, tip_num: number) => {
        if (!pid) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }
    
        let api = gConst.apiRoot + "/play/unlock-tips";
        let res = await fetchPostWithSign(api, {
            pid,
            tip_num
        });
        let data = await res.json() as BasicResponse;
    
        if (data.status == 1) {
            await reloadTip(pid);
        } else {
            defaultApiErrorAction(data);
        }
    }

    const reloadTip = async (pid: number) => {
        let api = gConst.apiRoot + "/play/get-tips";
        let res = await fetchPostWithSign(api, {
            pid
        });
        let data = await res.json() as GetTipsResponse;
    
        if (data.status == 1) {
            if (data.puzzle_tips) {
                for (let pti in data.puzzle_tips) {
                    data.puzzle_tips[pti].content_html = "";
                    if (data.puzzle_tips[pti].content && data.puzzle_tips[pti].content.length > 0) {
                        data.puzzle_tips[pti].content_html = marked(data.puzzle_tips[pti].content);
                    }
                }
    
                answerTips.value = data.puzzle_tips
            }
            powerPoint.value = data.power_point;
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        answerTips,
        powerPoint,
        showTip,
        unlockTip,
        reloadTip
    }
}
