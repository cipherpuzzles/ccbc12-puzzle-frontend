import { Modal } from "bootstrap";
import { nextTick, ref } from "vue";
import gConst from "../../gstatus/const";
import { BasicResponse, defaultApiErrorAction, fetchPostWithSign } from "../../utils/fetchPost";

interface PuzzlesScoreboardItem {
    type: number;
    name: string;
    desc: string;
    number: number;
    last_correct_time: number;
}

interface PuzzlesScoreboardResponse extends BasicResponse {
    data: PuzzlesScoreboardItem[];
}

export default function usePuzzlesScoreboard() {
    const scoreboard = ref<PuzzlesScoreboardItem[]>([]);

    const PuzzlesScoreboardDialog = () => {
        return (
            <div class="modal fade" id="puzzlesScoreboard" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="puzzlesScoreboardLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title" id="puzzlesScoreboardLabel">排行榜</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>排行榜说明：</p>
                            <ul>
                                <li>除了参赛队伍外，一些未报名的用户将以个人身份参与排名，他们名字后面会带上标签。但是他们并不会影响比赛结果。</li>
                                <li>本排行榜按照解出题目数多少排序，若解出题目数相同，则按解出最后一题的时间排序，解出的越早排序越高。时间记录到毫秒级别，因此不会有并列名次。</li>
                            </ul>
                            <table class="table table-striped table-dark table-hover">
                                <colgroup>
                                    <col width="48" />
                                    <col />
                                    <col width="130" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">排名</th>
                                        <th scope="col">名称</th>
                                        <th scope="col">解答题目数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scoreboard.value.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div class="table-cell">
                                                        <div class="group-title">{item.name}{item.type === 1 && (<span class="personal-badge">个人</span>)}</div>
                                                        <div class="group-profile">{item.desc}</div>
                                                    </div>
                                                </td>
                                                <td>{item.number}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const showPuzzlesScoreboard = async () => {
        let api = gConst.apiRoot + "/play/get-puzzles-scoreboard";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json() as PuzzlesScoreboardResponse;

        if (data.status === 1) {
            scoreboard.value = data.data;

            nextTick(() => {
                const puzzlesScoreboardDialogEl = document.getElementById('puzzlesScoreboard');
                if (!puzzlesScoreboardDialogEl) return;
        
                const puzzlesScoreboardDialog = new Modal(puzzlesScoreboardDialogEl);
                puzzlesScoreboardDialog.show();
            });
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        PuzzlesScoreboardDialog,
        showPuzzlesScoreboard
    };
}