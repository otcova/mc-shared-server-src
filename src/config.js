import electron from "electron"
electron.webFrame.setZoomFactor(1)
// electron.ipcRenderer.send('resize-window', 400, 110)
window.electron = electron;

const nativeClose = window.close
window.close = () => {
	nativeClose()
	setTimeout(()=>electron.ipcRenderer.send('close-window'), 0)
}