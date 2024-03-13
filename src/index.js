import { app, BrowserWindow, ipcMain } from "electron";

const path = require("node:path");
const fs = require("node:fs");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setAlwaysOnTop(true);

  win.loadFile("./index.html");
  // win.webContents.openDevTools();
  win.setIgnoreMouseEvents(true);
};

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

const getImgList = async (e, imgType) => {
  const path = imgType.split("-").join("/");
  const list = await getAllFiles(`./assets/pet/vup/${path}`);
  return list;
};

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
  ipcMain.handle("getImgList", getImgList);
  ipcMain.on("set-ignore-mouse-events", (event, ignore, options) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win.setIgnoreMouseEvents(ignore, options);
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
