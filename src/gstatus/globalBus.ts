import mitt from "mitt";

export type MessageType = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary' | 'dark' | 'light';

type EventMessageType = {
    reload: void;
    'show-message': {
        message: string;
        title: string;
        type: MessageType;
    };
    'show-error': string;
    'redirect-location': {
        location: string;
        message: string;
    };
    'log-out': {
        message: string;
    },
    message: {
        message: string;
        type: MessageType;
    },
    'puzzle-reload': void
}

const globalBus = mitt<EventMessageType>();

export default globalBus;