import { nextTick, ref } from 'vue';
import globalBus from '../../gstatus/globalBus';
import gConst from '../../gstatus/const';
import { Modal } from 'bootstrap';
import { marked } from 'marked';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';
import { powerPointConfirm } from './ppConfirm';

import type { BasicResponse } from '../../utils/fetchPost';

interface GetPuzzleTipsResponse extends BasicResponse {
    is_tip_available: number;
    tip_available_time: number;
    tip_available_progress: number;
    unlock_cost: number;
    unlock_delay: number;
    puzzle_tips: PuzzleTipItem[];
    oracles: OracleSimpleItem[];
}

interface PuzzleTipItem {
    tips_id: number,
    tip_num: number,
    is_open: number,
    title: string,
    content: string,
    content_html: string
}

interface OracleSimpleItem {
    oracle_id: number,
    is_reply: number,
    unlock_time: number;
}

interface TipsStatus {
    is_tip_available: number;
    tip_available_time: number;
    tip_available_progress: number;
    unlock_cost: number;
    unlock_delay: number;
}

interface OpenOracleResponse extends BasicResponse {
    data: OracleItem;
}

interface OracleItem {
    oracle_id: number;
    gid: number;
    pid: number;
    question_content: string;
    update_time: number;
    create_time: number;
    is_reply: number;
    reply_time: number;
    reply_content: string;
    reply_content_html: string;
    unlock_time: number;
    extend_function: string;
    extend_function_render: string;
}

export default function useTipsPart() {
    const answerTips = ref<PuzzleTipItem[]>([]);
    const oracles = ref<OracleSimpleItem[]>([]);
    const tipsStatus = ref<TipsStatus>({
        is_tip_available: 0,
        tip_available_time: 0,
        tip_available_progress: 0,
        unlock_cost: 0,
        unlock_delay: 0
    });
    const currentOracle = ref<OracleItem | null>(null);

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

    const unlockTip = async (year: number, tip_num: number) => {
        if (!year) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }

        let ppConfirmResult = await powerPointConfirm(`正在通过 HINT 系统提取 #${tip_num} 信息。这将消耗能量，确定要继续吗？`, tipsStatus.value.unlock_cost);
        if (!ppConfirmResult) return;
    
        let api = gConst.apiRoot + "/play/unlock-tips";
        let res = await fetchPostWithSign(api, {
            year,
            tip_num
        });
        let data = await res.json() as BasicResponse;
    
        if (data.status == 1) {
            globalBus.emit("puzzle-reload");
            await reloadTip(year);
        } else {
            defaultApiErrorAction(data);
        }
    }

    const reloadTip = async (year: number) => {
        let api = gConst.apiRoot + "/play/get-tips";
        let res = await fetchPostWithSign(api, {
            year
        });
        let data = await res.json() as GetPuzzleTipsResponse;
    
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
            if (data.oracles) {
                oracles.value = data.oracles;
            }
            tipsStatus.value = {
                is_tip_available: data.is_tip_available,
                tip_available_time: data.tip_available_time,
                tip_available_progress: data.tip_available_progress,
                unlock_cost: data.unlock_cost,
                unlock_delay: data.unlock_delay
            }
        } else {
            defaultApiErrorAction(data);
        }
    }

    const addOracleReq = async (year: number) => {
        if (!year) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }

        let ppConfirmResult = await powerPointConfirm(`消耗能量后将显示新条目，请提交当前已知信息，描述越详细越能获得有价值的回复。
        回复最早于请求后的 ${(tipsStatus.value.unlock_delay / 60).toFixed(1)} 小时后可见。
        建议您在请求前准备好描述内容。`, tipsStatus.value.unlock_cost);
        if (!ppConfirmResult) return;

        let api = gConst.apiRoot + "/play/add-oracle";
        let res = await fetchPostWithSign(api, {
            year
        });
        let data = await res.json() as BasicResponse;
    
        if (data.status == 1) {
            globalBus.emit("puzzle-reload");
            await reloadTip(year);
        } else {
            defaultApiErrorAction(data);
        }
    }

    const openOracle = async (oracle_id: number) => {
        if (!oracle_id) {
            globalBus.emit("message", {
                type: "info",
                message: "Oracle ID不正确"
            });
            return;
        }

        let api = gConst.apiRoot + "/play/open-oracle";
        let res = await fetchPostWithSign(api, {
            oracle_id
        });
        let data = await res.json() as OpenOracleResponse;

        if (data.status == 1) {
            let oracleItem = data.data;
            if (oracleItem.reply_content) {
                oracleItem.reply_content_html = marked(oracleItem.reply_content)
            }
            if (oracleItem.extend_function) {
                let efa = oracleItem.extend_function.split(',').sort();
                oracleItem.extend_function_render = efa.map(e => `#${e}`).join(', ');
            }
            currentOracle.value = oracleItem;

            nextTick(() => {
                let tipEl = document.getElementById("oracleEditDialog");
                if (!tipEl) return;
                var tipDialog = new Modal(tipEl);
                tipDialog.show();
            });
        } else {
            defaultApiErrorAction(data);
        }
    }

    const editOracle = async () => {
        if (!currentOracle.value?.oracle_id) {
            globalBus.emit("message", {
                type: "info",
                message: "Oracle ID不正确"
            });
            return;
        }

        if (!currentOracle.value?.question_content) {
            globalBus.emit("message", {
                type: "info",
                message: "内容不能为空。"
            });
            return;
        }

        let api = gConst.apiRoot + "/play/edit-oracle";
        let res = await fetchPostWithSign(api, {
            oracle_id: currentOracle.value.oracle_id,
            question_content: currentOracle.value.question_content,
        });
        let data = await res.json() as BasicResponse;

        if (data.status == 1) {
            globalBus.emit("message", {
                type: "success",
                message: "编辑成功"
            })
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        answerTips,
        oracles,
        tipsStatus,
        currentOracle,
        showTip,
        unlockTip,
        addOracleReq,
        openOracle,
        editOracle
    }
}
