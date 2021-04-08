import { contextBridge, ipcRenderer } from 'electron';
import { SendChannels } from './Channels';

contextBridge.exposeInMainWorld('electron', {
    send: (channel: string, data: any) => {
        return ipcRenderer.send(channel, data);
    },
    subscribe: (channel: string, listener: any) => {
        const subscription = (event: any, ...args: any) => listener(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
    receive: (channel: string, func: any) => {
        const validChannels: string[] = Object.values(SendChannels);
        if (validChannels.includes(channel) || true) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
});
