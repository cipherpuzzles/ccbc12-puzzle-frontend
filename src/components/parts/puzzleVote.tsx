import globalStatus from '../../gstatus/status';
import globalBus from '../../gstatus/globalBus';
import gConst from '../../gstatus/const';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/fetchPost';

import type { BasicResponse } from '../../utils/fetchPost';

import iconDislike from '../../assets/icon/icon_dislike.svg';
import iconDislikeSelected from '../../assets/icon/icon_dislike_selected.svg';
import iconLike from '../../assets/icon/icon_like.svg';
import iconLikeSelected from '../../assets/icon/icon_like_selected.svg';


export default function usePuzzleVote() {
    const VoteButton = (props: {type: "up" | "down", status: "on" | "off"}) => {
        if (props.status === "off") {
            if (props.type === "up") {
                return (<img src={iconLike} alt="like" />);
            } else {
                return (<img src={iconDislike} alt="dislike" />);
            }
        } else {
            if (props.type === "up") {
                return (<img src={iconLikeSelected} alt="like_on" />);
            } else {
                return (<img src={iconDislikeSelected} alt="dislike_on" />);
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