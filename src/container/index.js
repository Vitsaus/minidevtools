const { constants } = require('crypto');
const { app, BrowserWindow, globalShortcut, ipcMain, clipboard, Menu } = require('electron');
const path = require('path');
const {
  xml2xsd,
  xsd2jsonSchema,
  json2xsd,
  validateXml,
  detectXmlSchema,
  jsonSchema2xsd
} = require('xsdlibrary');

let win;

function createWindow () {

  //app.dock.hide();

  win = new BrowserWindow({
    width: 800,
    height: 660,
    frame: false,
    openDevTools: true,
    resizable: true,
    movable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.setMenu(null);
  win.setMenuBarVisibility(false);

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
    //win.openDevTools();
  });

}

app.whenReady().then(createWindow)

app.on('ready', () => {

  const template = [];

  const appMenu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(appMenu);

});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    win.show();
  }
});

app.on('browser-window-focus', (event, win) => {
  globalShortcut.register('Command+0', () => {
    if (!win) {
      createWindow();
    } else {
      win.show();
    }
  });
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
  event.preventDefault();
  win.hide();
  globalShortcut.unregister('Command+E');
  globalShortcut.unregister('Command+C');
  globalShortcut.unregister('Command+P');
});


