import { Modal } from "bootstrap";
import { nextTick, ref } from "vue";
import gConst from "../../gstatus/const";
import { BasicResponse, defaultApiErrorAction, fetchPostWithSign } from "../../utils/fetchPost";
import formatTimestamp from "../../utils/formatDate";

interface PuzzlesAnnoItem {
    pid: number;
    create_time: number;
    content: string;
}

interface PuzzlesAnnoResponse extends BasicResponse {
    data: PuzzlesAnnoItem[];
    sum_rows: number;
}

export default function usePuzzlesAnno() {
    const annoList = ref<PuzzlesAnnoItem[]>([]);
    const sumRows = ref(0);
    const page = ref(1);
    const pageSize = ref(20);

    const PuzzlesAnnoDialog = () => {
        return (
            <div class="modal fade" id="puzzlesAnno" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="puzzlesAnnoLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title" id="puzzlesAnnoLabel">公告</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {annoList.value.map((item, index) => {
                                return (
                                    <div class="anno-card" key={item.pid}>
                                        <div class="anno-card-time">{formatTimestamp(item.create_time)}</div>
                                        <div>{item.content}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const showPuzzlesAnno = async () => {
        let api = gConst.apiRoot + "/play/get-puzzles-anno";
        let res = await fetchPostWithSign(api, {
            page_num: page.value,
            page_size: pageSize.value
        });
        let data = await res.json() as PuzzlesAnnoResponse;

        if (data.status === 1) {
            annoList.value = data.data;
            sumRows.value = data.sum_rows;

            nextTick(() => {
                const puzzleAnnoDialogEl = document.getElementById('puzzlesAnno');
                if (!puzzleAnnoDialogEl) return;
        
                const puzzlesScoreboardDialog = new Modal(puzzleAnnoDialogEl);
                puzzlesScoreboardDialog.show();
            });
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        PuzzlesAnnoDialog,
        showPuzzlesAnno
    };
}