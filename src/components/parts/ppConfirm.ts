import { Modal } from "bootstrap";
import { ref } from "vue";

export interface PpConfirmMessage {
    message: string;
    pp: number;
    confirm: (result: boolean) => void;
}

export const ppConfirmMessage = ref<PpConfirmMessage>({message: '', pp: 0, confirm: () => {}});
export function powerPointConfirm(message: string, pp: number) {
    return new Promise((res, rej) => {
        const el = document.getElementById("ppConfirmDialog");
        if (!el) return;
        let modal = new Modal(el);
        modal.show();

        ppConfirmMessage.value = {
            message,
            pp,
            confirm: (result: boolean) => {
                modal.hide();
                res(result);
            }
        };
    });
}