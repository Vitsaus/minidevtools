const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 660,
    frame: false,
    openDevTools: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  ipcMain.on('message', (event, args) => {
    console.log('args', args);
  });

  ipcMain.on('close', (event, args) => {
    win.close();
  });
  
  win.loadURL(`file:///${__dirname}/index.html`).then(() => {
    const shortcut = globalShortcut.register('Command+0', () => {
      if (!win) return;
      win.show();
    });
  });

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

