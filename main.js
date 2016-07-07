'use strict';

const electron = require('electron');
// app: 控制應用程式生命週期的模組
const app = electron.app;
// BrowserWindow: 建立系統原生視窗 (native window) 的模組
const BrowserWindow = electron.BrowserWindow;

// 保留一個全域的物件關聯以避免 JavaScript 物件 GC 機制造成視窗自動關閉
let mainWindow;

function createWindow () {
  // 建立 browser window
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // 載入 mainWindow.html 作為畫面
  mainWindow.loadURL(__dirname + '/index.html');

  // 開啟開發者工具
  mainWindow.webContents.openDevTools();

  // 當 browser window 被關閉時，會送出 'closed' 訊號，並執行相關的 callback
  mainWindow.on('closed', function() {
    // 將此 window 物件解除關聯。
    // 如果你的應用程式支援多視窗，通常會將這些物件存在一個陣列裡面。
    // 現在就是刪除對應的視窗物件的時機。
    mainWindow = null;
  });
}

// 當 Electron 完成初始化並且可以開始建立視窗的時候，
// 會發送 'ready' 訊號，並執行對應的 callback
// 我們指定收到 'ready' 訊號時，執行 createWindow()
app.on('ready', createWindow);

// 當所有視窗都關閉時，結束應用程式 ( app.quit() )
app.on('window-all-closed', function () {
  // OS X 的使用習慣是當所有視窗關閉的時候，上方的 menu bar 仍然維持開啟
  // 此時應用程式還沒有完全關閉，除非使用者強制按 Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // OS X 通常在應用程式已經起來了，但是所有視窗關閉的時候，還可以重新建立主視窗
  if (mainWindow === null) {
    createWindow();
  }
});