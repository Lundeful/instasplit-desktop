type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

interface Electron {
    send: (channel: SendChannels, data?: any) => any;
    subscribe: (channel: string, listener: Listener) => Unsubscribe;
    receive: (channel: ReceiveChannels, func: any) => void;
    removeAllListeners: (channel: ReceiveChannels) => void;
}

export enum SendChannels {
    openSelectFileDialog = 'select-image',
    splitImage = 'split-image',
    close = 'close-app',
    restore = 'restore-app',
    maximize = 'maximize-app',
    minimize = 'minimize-app',
    isMaximised = 'is-maximized',
}

export enum ReceiveChannels {
    fileSelected = 'filepath-selected',
    isMaximized = 'is-maximized',
    success = 'success',
    error = 'error',
}

const electron = (window as any).electron as Electron;
export default electron;
