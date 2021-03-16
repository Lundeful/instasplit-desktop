import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    send: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
    },
    subscribe: (channel: string, listener: any) => {
        const subscription = (event: any, ...args: any) => listener(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
            ipcRenderer.removeListener(channel, subscription);
        };
    },
    receive: (channel: string, func: any) => {
        let validChannels = ['close-app', 'minimize', 'open-file'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
});
