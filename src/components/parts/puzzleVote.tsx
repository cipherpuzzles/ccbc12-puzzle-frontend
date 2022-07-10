import globalStatus from '../../gstatus/status';
import globalBus from '../../gstatus/globalBus';
import gConst from '../../gstatus/const';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';

import type { BasicResponse } from '../../utils/fetchPost';

export default function usePuzzleVote() {
    const VoteButton = (props: {type: "up" | "down", status: "on" | "off"}) => {
        if (props.status === "off") {
            if (props.type === "up") {
                return (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.11 5.72l-.57 2.89c-.12.59.04 1.2.42 1.66.38.46.94.73 1.54.73H20v1.08L17.43 18H9.34c-.18 0-.34-.16-.34-.34V9.82l4.11-4.1M14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.83C7 18.95 8.05 20 9.34 20h8.1c.71 0 1.36-.37 1.72-.97l2.67-6.15c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2zM4 9H2v11h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1z"/></svg>);
            } else {
                return (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none"/><path d="M10.89 18.28l.57-2.89c.12-.59-.04-1.2-.42-1.66-.38-.46-.94-.73-1.54-.73H4v-1.08L6.57 6h8.09c.18 0 .34.16.34.34v7.84l-4.11 4.1M10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4h-8.1c-.71 0-1.36.37-1.72.97l-2.67 6.15c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22zm10-7h2V4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1z"/></svg>);
            }
        } else {
            if (props.type === "up") {
                return (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none"/><path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/></svg>);
            } else {
                return (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M24 24H0V0h24v24z" fill="none"/><path d="M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4h-8.1c-.71 0-1.36.37-1.72.97l-2.67 6.15z"/></svg>);
            }
        }
    }

    const voteButtonClick = async (year: number, type: "up" | "down") => {
        if (!year) {
            globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }

        let vote_type = 0;
        if (type === "up") {
            if (globalStatus.currentPuzzleVoteStatus === 1) {
                vote_type = 0;
            } else {
                vote_type = 1;
            }
        } else {
            if (globalStatus.currentPuzzleVoteStatus === 2) {
                vote_type = 0;
            } else {
                vote_type = 2;
            }
        }

        let api = gConst.apiRoot + "/play/puzzle-vote";
        let res = await fetchPostWithSign(api, {
            year,
            vote_type
        });
        let data = await res.json() as BasicResponse;
    
        if (data.status == 1) {
            globalBus.emit("puzzle-reload");
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        VoteButton,
        voteButtonClick
    };
}