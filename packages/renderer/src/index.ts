import { ipcRenderer } from 'electron'

const elements = {
  directory: document.getElementById("directory")!,
  port: document.getElementById("port") as HTMLInputElement,
  selectDirectory: document.getElementById("select-directory")!,
  startServer: document.getElementById("start-server") as HTMLButtonElement
}

elements.selectDirectory.onclick = () => ipcRenderer.send("select-directory");
ipcRenderer.on("select-directory-reply", (_, arg) => {
  elements.directory.textContent = arg;
});

elements.startServer.onclick = () => {
  ipcRenderer.send("start-server", elements.port.value);
};

ipcRenderer.on("start-server-reply", (_, arg) => {
  if (arg.error) {
    alert(arg.error);
  } else {
    elements.startServer.disabled = true;
  }
});

ipcRenderer.on("store-loaded", (_, arg) => {
  elements.directory.textContent = arg.directory;
  elements.port.value = arg.port;
});

