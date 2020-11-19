const { app, BrowserWindow, globalShortcut, ipcMain, clipboard } = require('electron');
const path = require('path');
const {
  xml2xsd,
  xsd2jsonSchema,
  json2xsd,
  validateXml,
  detectXmlSchema,
  jsonSchema2xsd
} = require('xsdlibrary');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 660,
    frame: false,
    openDevTools: true,
    resizable: true,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  ipcMain.handle('validateXML', async (event, xml) => {
    try {
      return validateXml(xml);
    } catch(e) {
      return false;
    }
  });

  ipcMain.on('close', (event, args) => {
    win.close();
  });
  
  win.loadURL(`file:///${__dirname}/index.html`).then(() => {
    win.openDevTools();
    globalShortcut.register('Command+0', () => {
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
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

app.on('browser-window-focus', (event, win) => {
  globalShortcut.register("Command+E", () => {
    console.log('edit');
    win.webContents.send('edit');
  });
  globalShortcut.register("Command+C", () => {
    console.log('copy');
    win.webContents.send('copy');
  });
  globalShortcut.register("Command+P", () => {
    const value = clipboard.readText("clipboard")
    console.log('paste', value);
    win.webContents.send('paste', value);
  });
});

app.on('browser-window-blur', (event, win) => {
  globalShortcut.unregister('Command+E');
  globalShortcut.unregister('Command+C');
  globalShortcut.unregister('Command+P');
});

