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
const vm = require('vm');

let win: Electron.BrowserWindow;

function createWindow () {

  //app.dock.hide();

  win = new BrowserWindow({
    width: 800,
    height: 660,
    frame: false,
    resizable: true,
    movable: true,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
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

  ipcMain.handle('jsEval', async (event, code) => {
    try {
      const result = vm.runInNewContext(code);
      console.log('got code from eval', code);      
      return result;
    } catch(e) {
      console.log('eval failed', e)
      return e;
    }
  });

  ipcMain.on('close', (event, args) => {
    win.close();
  });

  win.loadURL(`file:///${__dirname}/index.html`).then(() => {
    console.log('window loaded!');
  });

}

function createMenu() {

  const menu: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Undo',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll',
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload',
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+D',
          role: 'toggleDevTools',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ]
    },
  ]

  return Menu.buildFromTemplate(menu);
}

app.whenReady().then(createWindow)

app.on('ready', () => {
  Menu.setApplicationMenu(createMenu());
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


