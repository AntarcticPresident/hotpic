// const { app, BrowserWindow, Menu } = require('electron')
import { app, BrowserWindow, Menu, dialog } from 'electron'

const template = [
  {
    label: '文件',
    accelerator: 'CmdOrCtrl+O',
    role: 'open',
    click () {
      dialog.showOpenDialog({
        title: '导入文件',
        filters: [{
          name: 'xlsx',
          extensions: ['xlsx']
        }]
      }).then(res => {
        console.log(res.filePaths)
      })
    }
  },
  {
    label: '刷新',
    accelerator: 'CmdOrCtrl+R',
    role: 'refresh',
    click (item, focusedWindow) {
      if (focusedWindow) {
        // 重载之后, 刷新并关闭所有的次要窗体
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
  }
]
const menu = Menu.BuildFromTemplate(template)
function createWindow () {
  Menu.setApplicationMenu(menu)
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './main.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  // win.webContents.openDevTools()
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})