const { app, BrowserWindow, globalShortcut, ipcMain, clipboard, Menu, Tray, nativeImage } = require('electron');
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

  const nativeImage = require('electron').nativeImage;
  const image = nativeImage.createFromPath(path.join(__dirname, 'resources', 'favicon.ico')); 
  image.setTemplateImage(true);

  win = new BrowserWindow({
    width: 800,
    height: 660,
    frame: false,
    resizable: true,
    movable: true,
    autoHideMenuBar: false,
    icon: image,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    }
  });

  win.once('focus', () => win.flashFrame(false));
  win.flashFrame(true);

  //win.setMenu(null);
  //win.setMenuBarVisibility(false);

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
    console.log('window loaded');
    win.webContents.openDevTools();
    win.setIcon(path.join(__dirname, 'resources', 'favicon.ico'));
    win.on("focus", () => {
      console.log('window focused');
    });
    win.on('close', (e) => {
      console.log('close window!');
    })
    win.on('closed', () => {
      console.log('window closed!');
    })
    win.on('hide', (e) => {
      console.log('window hide!')
      
      e.preventDefault();
    })
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

  if (process.platform !== 'win32') {
    return;
  }

  const tray = new Tray(path.join(__dirname, 'resources', 'favicon.ico'));

  const menu = Menu.buildFromTemplate ([
    {
      label: 'Exit',
      click() { app.quit() }
    },
    {
      label: 'Unhide',
      click: () => {
        if (!win) {
          return console.log('window not found');
        }
        win.show();
      }
    },
    {  label: 'Help',
    click() { null; }}
  ])

  tray.setToolTip('ElectronApplication');
  tray.setContextMenu(menu);

  if (process.platform === 'win32' ) {
    tray.on('click', () => {
      tray.popUpContextMenu();
    });
  }

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('quit application, no windows are open!');
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    win.show();
  }
});

app.on('browser-window-focus', (event, win) => {
  globalShortcut.register('Ctrl+0', () => {
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


