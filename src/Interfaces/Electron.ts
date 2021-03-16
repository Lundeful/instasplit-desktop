type Unsubscribe = () => void;
type Listener = (...args: any[]) => void;

interface Electron {
    send: (channel: string, data?: any) => void;
    subscribe: (channel: string, listener: Listener) => Unsubscribe;
}

const electron = (window as any).electron as Electron;
export default electron;
