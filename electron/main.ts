import { app, BrowserWindow, dialog, ipcMain, protocol } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { ReceiveChannels, SendChannels } from './Channels';

let mainWindow: BrowserWindow;
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';

let chosenImage: sharp.Sharp;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000 * 1.25,
        height: 600 * 1.25,
        minHeight: 400,
        minWidth: 600,
        frame: isMac,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (isDev) {
        mainWindow.loadFile('index.html');
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }

    addListeners(mainWindow);
    const protocolName = 'instasplit';
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.replace(`${protocolName}://`, '');
        try {
            return callback(decodeURIComponent(url));
        } catch (error) {
            console.error(error);
        }
    });
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (!isMac) app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const addListeners = (mainWindow: BrowserWindow) => {
    mainWindow.on('minimize', sendIsMaximised);
    mainWindow.on('restore', sendIsMaximised);
    mainWindow.on('maximize', sendIsMaximised);
    mainWindow.on('resized', sendIsMaximised);
    mainWindow.on('moved', sendIsMaximised);
};

ipcMain.on(ReceiveChannels.closeApp, (event, args) => {
    BrowserWindow.getAllWindows().forEach((win) => win.close());
    if (!isMac) app.quit();
});

ipcMain.on(ReceiveChannels.minimizeApp, (event, args) => {
    mainWindow.minimize();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.maximizeApp, (event, args) => {
    if (mainWindow.isMaximizable()) mainWindow.maximize();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.restoreApp, (event, args) => {
    mainWindow.restore();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.selectImage, async (event, args) => {
    const path = await openImage();
    if (chosenImage != null) {
        const size = await getImageDimensions();
        mainWindow.webContents.send(SendChannels.fileSelected, path);
    }
});

ipcMain.on('is-maximized', (event, args) => {
    return mainWindow.isMaximized();
});

const sendIsMaximised = () => {
    mainWindow.webContents.send(SendChannels.isMaximized, mainWindow.isMaximized());
};

ipcMain.on(ReceiveChannels.splitImage, async (event, cropInfo) => {
    if (chosenImage != null) {
        try {
            const didSave = await splitAndSave(cropInfo);
            if (didSave) mainWindow.webContents.send(SendChannels.success);
        } catch {
            mainWindow.webContents.send(SendChannels.error);
        }
    }
});

const openImage = async (): Promise<string | undefined | any> => {
    return dialog
        .showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
        })
        .then((result) => {
            if (result.canceled) return;
            const filepath = result.filePaths[0];
            const image = fs.readFileSync(filepath);
            const sharpImage = sharp(image);
            chosenImage = sharpImage;
            return filepath.replace(/\\/g, '\\');
        });
};

const splitAndSave = async (cropInfo: {
    x: number;
    y: number;
    width: number;
    height: number;
    splitAmount: number;
}): Promise<boolean> => {
    console.log(cropInfo);
    if (!chosenImage) return false;

    return dialog.showSaveDialog(mainWindow).then(async (result) => {
        if (result.canceled) return false;

        // Split details
        const { width, height, x, y, splitAmount } = cropInfo;
        const splitWidth = Math.floor(width / splitAmount);
        const topOffset = y;

        // Split
        const splitImages: sharp.Sharp[] = [];
        for (let index = 0; index < splitAmount; index++) {
            const splitImage = chosenImage.clone();
            const leftOffset = x + splitWidth * index;

            splitImage.extract({ left: leftOffset, top: topOffset, width: splitWidth, height: height });
            splitImages.push(splitImage);
        }

        // Save
        splitImages.forEach((img, index) => {
            img.toFile(`${result.filePath}_split_${index + 1}.jpg`).then((info) => {
                info.format = 'jpg';
            });
        });
        return true;
    });
};

const getImageDimensions = () => {
    return chosenImage?.metadata().then((meta) => {
        return { width: meta.width, height: meta.height };
    });
};
