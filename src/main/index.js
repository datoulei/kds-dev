'use strict';
const electron = require('electron')
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';
import db from '../db';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\');
}

let loginWindow;
let innerWindow;
let outerWindow;
let orderList;
let overTime;
let inner;
let outer;

const loginURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/login`
    : `file://${__dirname}/index.html#/login`;
const innerURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/innerScreen`
    : `file://${__dirname}/index.html#/innerScreen`;
const outerURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/outerScreen`
    : `file://${__dirname}/index.html#/outerScreen`;

function createInnerWindow() {

  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  // const { width, height } = externalDisplay

  if (externalDisplay) {
    innerWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      height: 500,
      width: 1000,
      useContentSize: true,
      frame: false,
      resizable: true,
      fullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      }
    });
    innerWindow.loadURL(innerURL);
  } else {
    // 此处应该删除
    // innerWindow = new BrowserWindow({
    //   x: 0,
    //   y: 0,
    //   height: 500,
    //   width: 1000,
    //   useContentSize: true,
    //   frame: false,
    //   resizable: true,
    //   fullscreen: true,
    //   webPreferences: {
    //     nodeIntegration: true,
    //     webviewTag: true,
    //   }
    // });
    // innerWindow.loadURL(innerURL);
  }


}

function createOuterWindow() {
  outerWindow = new BrowserWindow({
    height: 670,
    useContentSize: true,
    width: 1000,
    frame: false,
    resizable: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    }
  });
  outerWindow.loadURL(outerURL);

}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    height: 434,
    useContentSize: true,
    width: 757,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    }
  });
  loginWindow.loadURL(loginURL);
}

app.on('ready', () => {
  const ret = globalShortcut.register('CmdOrCtrl+Shift+L', () => {
    console.log('active shortcut')
    if (innerWindow) {
      innerWindow.webContents.openDevTools()
    }
    if (outerWindow) {
      outerWindow.webContents.openDevTools()
    }
  })
  if (!ret) {
    console.log('shortcut faild')
  } else {
    console.log('shortcut success')
  }
  const token = db.has('token').value();
  if (token) {
    console.log('is login');
    createOuterWindow(); // 外屏
    createInnerWindow(); // 内屏
  } else {
    createLoginWindow();
    console.log('not login');
  }
});


ipcMain.on('orderList', (event, data) => {
  if (innerWindow) {
    innerWindow.webContents.send('getOrderList', data)
  }
});

// 监听两个屏幕是否加载完成
// 在连个屏幕加载完成的情况下发送订单数据
ipcMain.on("complete", (event, _orderList, _overTime, screenType) => {

  if (screenType === 'inner') {
    inner = true;
  }

  if (screenType === 'outer') {
    orderList = _orderList;
    overTime = _overTime;
    outer = true;
  }

  if (inner && outer) {
    innerWindow.webContents.send('getOrderList', orderList);
    innerWindow.webContents.send('getOverTime', overTime);
  }
})

// 进程监听
ipcMain.on('window', (event, data) => {
  console.log('TCL: event', event);
  if (outerWindow) {
    switch (data) {
      case 'minimize':
        outerWindow.minimize();
        break;
      case 'maximize':
        outerWindow.setFullScreen(!outerWindow.isFullScreen());
        break;
      case 'close':
        // 点击关闭时退出应用
        if (outerWindow) {
          outerWindow.close();
          outerWindow = null;
        }
        if (innerWindow) {
          innerWindow.close();
          innerWindow = null;
        }
        app.quit();
        break;
      default:
        break;
    }
    event.returnValue = 'ok';
  } else if (loginWindow) {
    switch (data) {
      case 'close':
        loginWindow.close();
        loginWindow = null;
        app.quit();
        break;
      default:
        break;
    }
  }
});

// 进程监听：登录成功事件
ipcMain.on('login', async (event, token) => {
  console.log('TCL: event', event);
  // 保存token
  await db.set('token', token).write();
  // 创建主窗口
  if (!innerWindow) {
    createInnerWindow();
  }
  if (!outerWindow) {
    createOuterWindow();
  }
  // 关闭登录窗口
  loginWindow.close();
  loginWindow = null;
  event.returnValue = 'ok';
});

// 进程监听： 注销登录事件
ipcMain.on('logout', async event => {
  console.log('TCL: event', event);
  // 清理token
  await db.unset('token').write();
  // 创建登录窗口
  createLoginWindow();
  // 关闭主窗口
  if (innerWindow) {
    innerWindow.close();
    innerWindow = null;
  }
  if (outerWindow) {
    outerWindow.close();
    outerWindow = null;
  }
  event.returnValue = 'ok';
});



// 清除token
//db.unset('token').write();
