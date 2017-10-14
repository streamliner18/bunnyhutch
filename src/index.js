import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import _ from 'lodash'

const menu_template = [{
    label: "Application",
    submenu: [
        { label: "About Bunnyhutch", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => app.quit()}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]},
    {
      label: "Debug",
      submenu: [
        {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }
      ]
    }
];


let allWindows = []
const isDevMode = process.execPath.match(/[\\/]electron/)

if (isDevMode) enableLiveReload({strategy: 'react-hmr'})

const createWindow = async () => {
  let mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
  })
  allWindows.push(mainWindow)
  mainWindow.loadURL(`file://${__dirname}/app-renderer/index.html`)
  if (isDevMode) installExtension(REACT_DEVELOPER_TOOLS)
  mainWindow.on('closed', () => {
    mainWindow = null
    _.remove(allWindows, mainWindow)
  })
}

app.on('ready', () => {
  createWindow()
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template));
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (allWindows.length == 0) createWindow()
})

ipcMain.on('asynchronous-message', function(event, arg) {
  if (arg == 'NEW_WINDOW') createWindow()
})
