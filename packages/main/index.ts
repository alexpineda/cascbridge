process.env.DIST = join(__dirname, '..')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { opts, server } from "../server"
import { store } from './store'

const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'CASCBridge',
    width: 400,
    height: 400,
    webPreferences: {
      preload: join(process.env.DIST, 'preload/index.cjs'),
      contextIsolation: false,
      nodeIntegration: true,
    },
    resizable: true,
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('store-loaded', {
      directory: store.get("directory", ""),
      port: store.get("port", ""),
    })
  })

  if (app.isPackaged) {
    win.loadFile(join(process.env.DIST, 'renderer/index.html'))
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // win.webContents.openDevTools({ mode: 'undocked' })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})



const showOpenFolderDialog = (onOpen?: (filePaths: string[]) => void) =>
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then(({ filePaths, canceled }) => {
      if (canceled) return;
      onOpen && onOpen(filePaths);
      return filePaths;
    })
    .catch((err) => {
      dialog.showMessageBox({
        type: "error",
        title: "Error Loading File",
        message: "There was an error selecting path: " + err.message,
      });
    });

ipcMain.on('select-directory', (event, arg) => {
  showOpenFolderDialog((filePaths) => {

    store.set("directory", filePaths[0]);
    event.sender.send('select-directory-reply', filePaths[0]);

  });
});

ipcMain.on('start-server', (event, arg) => {
  store.set("port", arg);
  opts.path = store.get("directory");
  console.log(arg, opts.path)
  try {
    server.listen(arg, "localhost")
    event.sender.send('start-server-reply', {});
  } catch (e) {
    event.sender.send('start-server-reply', { error: (e as Error).message ?? "Error starting server" });
  }
});