process.env.DIST = join(__dirname, '..')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { server } from "./server"
import { store } from './store'
import { createWindow, win } from './window'
import { openCascStorage, setStoragePath } from './lib/casclib'
import { looksLikeStarCraftDir } from './lib/files'

const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}


app.whenReady().then(async () => {

  await createWindow();

  win.webContents.on('did-finish-load', async () => {
    win?.webContents.send('store-loaded', {
      folder: store.get("directory", ""),
      port: store.get("port", ""),
      isValid: await looksLikeStarCraftDir(store.get("directory", "") as string)
      
    })
  });

})


app.on('window-all-closed', () => {
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
      return filePaths;
    })
    .catch((err) => {
      dialog.showMessageBox({
        type: "error",
        title: "Error Loading File",
        message: "There was an error selecting path: " + err.message,
      });
    });

ipcMain.on('select-directory', async (event, arg) => {
  const files = await showOpenFolderDialog();
  
  if (files?.length) {
    if (await looksLikeStarCraftDir(files[0])) {
      store.set("directory", files[0]);
      setStoragePath(files[0]);
      const isValid = await openCascStorage();
      event.sender.send('select-directory-reply', { folder: files[0], isValid } );
    } else {
      event.sender.send('select-directory-reply', { folder: files[0], isValid: false } );
    }
  }

});

ipcMain.on('start-server', (event, arg) => {
  store.set("port", arg);

  setStoragePath(store.get("directory") as string)
  
  try {
    server.listen(arg, "localhost");
    event.sender.send('start-server-reply', {});
  } catch (e) {
    event.sender.send('start-server-reply', { error: (e as Error).message ?? "Error starting server" });
  }
});