import { ipcRenderer } from 'electron'

const elements = {
  directory: document.getElementById("directory")!,
  port: document.getElementById("port") as HTMLInputElement,
  selectDirectory: document.getElementById("select-directory")!,
  startServer: document.getElementById("start-server") as HTMLButtonElement,
  error: document.getElementById("error") as HTMLParagraphElement,
  selectDirHelp: document.getElementById("select-dir-help") as HTMLParagraphElement,
  serverLog: document.getElementById("server-log") as HTMLParagraphElement,
}

elements.selectDirectory.onclick = () => ipcRenderer.send("select-directory");

ipcRenderer.on("select-directory-reply", (_, { folder, isValid }) => {
  const isError = (!isValid && folder);
  elements.directory.textContent = folder;
  elements.error.style.display = isError ? "block" : "none";
  elements.selectDirHelp.style.display = isError ? "none" : "block";
  elements.startServer.disabled = isError || !folder;
});

elements.startServer.onclick = () => {
  ipcRenderer.send("start-server", elements.port.value);
};

ipcRenderer.on("start-server-reply", (_, arg) => {
  if (arg.error) {
    alert(arg.error);
  } else {
    elements.startServer.disabled = true;
    elements.startServer.textContent = "Server Running";
    elements.serverLog.textContent = "";
  }
});

ipcRenderer.on("store-loaded", (_, { folder, port, isValid}) => {
  const isError = (!isValid && folder);
  elements.directory.textContent = folder;
  elements.port.value = port;
  elements.error.style.display = isError ? "block" : "none";
  elements.selectDirHelp.style.display = isError ? "none" : "block";
  elements.startServer.disabled = isError || !folder;

});

ipcRenderer.on("server-log", (_, arg) => {
  elements.serverLog.textContent = arg;
});