import os from 'os';
import { join } from 'path';
import { app, dialog, ipcMain, BrowserWindow } from 'electron';
import { SavedWindowState, store } from './store';
import chokidar, { FSWatcher } from 'chokidar';

const isWin7 = os.release().startsWith('6.1');
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
let watcher: FSWatcher | null = null;

async function createWindow() {
  const { isMaximized, x, y, width, height } =
    ((await store.get('window')) as SavedWindowState) ?? {};

  win = new BrowserWindow({
    title: 'Catwalk',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
    ...(!isMaximized && {
      x,
      y,
      width,
      height,
    }),
  });

  if (isMaximized) {
    win.maximize();
  }

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    const pkg = await import('../../package.json');
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  win.on('close', () => {
    const windowState = {
      isMaximized: !!win!.isMaximized(),
      ...win?.getBounds(),
    };
    store.set('window', windowState);
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  ipcMain.handle('open-file', event => {
    return dialog
      .showOpenDialog(win!, {
        properties: ['openFile'],
        title: 'Open model file',
        filters: [
          {
            name: 'GLTF File',
            extensions: ['gltf', 'glb'],
          },
        ],
      })
      .then(result => {
        return result.filePaths.length > 0 ? result.filePaths[0] : undefined;
      });
  });

  ipcMain.on('watch', (event, path) => {
    if (watcher) {
      watcher.close();
    }
    watcher = chokidar.watch(path);
    watcher.on('change', path => {
      win?.webContents.send('watch-change', path);
    });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
