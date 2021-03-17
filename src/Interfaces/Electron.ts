type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

interface Electron {
    send: (channel: string, data?: any) => any;
    subscribe: (channel: string, listener: Listener) => Unsubscribe;
    receive: (channel: string, func: any) => void;
}

const electron = (window as any).electron as Electron;
export default electron;
