const { app, BrowserWindow, Menu } = require('electron')
const electron = require('electron')

function createWindow() {
  Menu.setApplicationMenu(null)
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