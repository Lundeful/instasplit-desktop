import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
let mainWindow: BrowserWindow;

let currentImage: sharp.Sharp;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000 * 1.25,
        height: 600 * 1.25,
        // resizable: false,
        // frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (isDev) {
        mainWindow.loadFile('index.html');
    } else {
        mainWindow.loadURL('http://localhost:3000');
    }

    const template: any[] = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: 'about' },
                          { type: 'separator' },
                          { role: 'services' },
                          { type: 'separator' },
                          { role: 'hide' },
                          { role: 'hideothers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { role: 'quit' },
                      ],
                  },
              ]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File',
                    accelerator: 'CmdOrCtrl+O',
                    click() {
                        openImage();
                    },
                },
                { label: 'Open Folder' },
                isMac ? { role: 'close' } : { role: 'quit' },
            ],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                          { role: 'pasteAndMatchStyle' },
                          { role: 'delete' },
                          { role: 'selectAll' },
                          { type: 'separator' },
                          {
                              label: 'Speech',
                              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
                          },
                      ]
                    : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
            ],
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
                    : [{ role: 'close' }]),
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org');
                    },
                },
            ],
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle developer tools',
                    accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click() {
                        mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
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

ipcMain.on('close-app', (event, args) => {
    console.log('Closing app');

    BrowserWindow.getAllWindows().forEach(win => win.close());
    if (!isMac) app.quit();
});

ipcMain.on('minimize', (event, args) => {
    console.log('Minimizing');
    mainWindow.minimize();
});

ipcMain.on('select-image', async (event, args) => {
    console.log('Selecting image');
    const path = await openImage();

    if (currentImage != null) mainWindow.webContents.send('filepath-selected', path);
});

ipcMain.on('save-image', async (event, args) => {
    console.log('Saving image');
    if (currentImage != null) saveImage();
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
            currentImage = sharpImage;
            return filepath;
        });
};

const saveImage = () => {
    if (currentImage) {
        dialog.showSaveDialog(mainWindow).then((result) => {
            if (result.canceled) return;

            currentImage.blur(20);
            currentImage.toFile(result.filePath + '.png').then((info) => {
                info.format = 'png';
            });
        });
    }
};
