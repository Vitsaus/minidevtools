const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
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
    globalShortcut.register('Command+0', () => {
      if (!win) return;
      win.show();
    });
    globalShortcut.register("CommandOrControl+R", () => {
      console.log("CommandOrControl+R is pressed: Shortcut Disabled");
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

