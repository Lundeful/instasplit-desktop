import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { ReceiveChannels, SendChannels } from './Channels';

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

const numberOfSplitImages = 3;
let rawImage: sharp.Sharp;
let splitImages: sharp.Sharp[] = [];

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000 * 1.25,
        height: 600 * 1.25,
        frame: false,
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
    mainWindow.on('resize', sendIsMaximised);
    mainWindow.on('minimize', sendIsMaximised);
    mainWindow.on('restore', sendIsMaximised);
    mainWindow.on('maximize', sendIsMaximised);
};

ipcMain.on(ReceiveChannels.closeApp, (event, args) => {
    console.log('Closing app');
    BrowserWindow.getAllWindows().forEach((win) => win.close());
    if (!isMac) app.quit();
});

ipcMain.on(ReceiveChannels.minimizeApp, (event, args) => {
    console.log('Minimizing window');
    mainWindow.minimize();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.maximizeApp, (event, args) => {
    console.log('Maximizing window');
    if (mainWindow.isMaximizable()) mainWindow.maximize();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.restoreApp, (event, args) => {
    console.log('Restoring window');
    mainWindow.restore();
    sendIsMaximised();
});

ipcMain.on(ReceiveChannels.selectImage, async (event, args) => {
    console.log('Selecting image');
    const path = await openImage();
    if (rawImage != null) mainWindow.webContents.send(SendChannels.fileSelected, path);
});

const sendIsMaximised = () => {
    console.log('Sending isMaximized value');
    mainWindow.webContents.send(SendChannels.isMaximized, mainWindow.isMaximized());
};

ipcMain.on('is-maximized', (event, args) => {
    console.log('Returning isMaximized');
    return mainWindow.isMaximized();
});

ipcMain.on(ReceiveChannels.splitImage, async (event, args) => {
    console.log('Splitting image');
    if (rawImage != null) {
        saveImage();
    }
});

const openImage = async (): Promise<string | undefined> => {
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
            rawImage = sharpImage;
            return filepath;
        });
};

// const splitImage = (): void => {
//     if (rawImage) {
//     }
// };

const saveImage = () => {
    if (rawImage) {
        dialog.showSaveDialog(mainWindow).then(async (result) => {
            if (result.canceled) return;

            const { width, height } = await getImageDimensions(rawImage);
            if (width && height) {
                const splitWidth = Math.floor(width / 3);
                const splitHeight = Math.floor((splitWidth * height) / width);
                const topOffset = Math.floor(height / 2 - splitHeight / 2);

                for (let index = 0; index < numberOfSplitImages; index++) {
                    const splitImage = rawImage.clone();
                    const leftOffset = splitWidth * index;

                    splitImage.extract({ left: leftOffset, top: topOffset, width: splitWidth, height: splitHeight });
                    splitImages.push(splitImage);
                }

                splitImages.forEach((img, index) => {
                    img.toFile(`${result.filePath}_split_${index + 1}.png`).then((info) => {
                        info.format = 'png';
                    });
                });
                console.log('Done');
            }
        });
    }
};

const getImageDimensions = (image: sharp.Sharp) => {
    return image.metadata().then((meta) => {
        return { width: meta.width, height: meta.height };
    });
};
