const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
let win = null;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
app.commandLine.appendSwitch('disable-pinch');

ipcMain.on('resize-window', (event, width, height) => {
    let browserWindow = BrowserWindow.fromWebContents(event.sender)
    browserWindow.setSize(width,height)
})

ipcMain.on('hide-window', (event) => {
    win.hide()
})

ipcMain.on('show-window', (event) => {
	win.show()
})

ipcMain.on('close-window', (event) => {
	win.close()
	app.quit()
	process.exit(0)
})

function createWindow() {
	win = new BrowserWindow({
		width: 500,
		height: 120,
		minWidth: 500,
		minHeight: 120,
		frame: false,
		resizable: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	})
	
	win.loadFile('./dist/index.html')
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