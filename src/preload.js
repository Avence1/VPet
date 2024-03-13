const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("ContentAPI", {
  getImgList: (type) => ipcRenderer.invoke("getImgList", type),
});

window.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("VPet");
  el.addEventListener("mouseenter", () => {
    ipcRenderer.send("set-ignore-mouse-events", false);
  });
  el.addEventListener("mouseleave", () => {
    ipcRenderer.send("set-ignore-mouse-events", true);
  });
});
