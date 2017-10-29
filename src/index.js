import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import _ from 'lodash'
import { menu_template } from './menu'

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
