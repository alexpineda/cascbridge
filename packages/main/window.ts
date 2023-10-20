import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { store } from './store'
import { isValid } from './lib/files';

export let win: BrowserWindow;

export async function createWindow() {
    const _win = new BrowserWindow({
      title: 'CASCBridge',
      width: 1000,
      height: 800,
      webPreferences: {
        preload: join(process.env.DIST, 'preload/index.cjs'),
        contextIsolation: false,
        nodeIntegration: true,
        devTools: true,
      },
      resizable: true,
    });
    _win.removeMenu();

  
    if (app.isPackaged) {
      _win.loadFile(join(process.env.DIST, 'renderer/index.html'))
    } else {
      _win.loadURL(process.env.VITE_DEV_SERVER_URL)
      // _win.webContents.openDevTools({ mode: 'undocked' })
    }

    win = _win;
  }
  