import React from "react"
import { SceneLockServer } from "./LockServer"
import * as DataBase from "../DataBase"
import { SceneButtons } from "./Buttons"
import childProcess from "child_process"
import { SceneUnlockServer } from "./UnlockServer"
import { changeScene } from ".."

import path from "path"

export class SceneOpenServer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { text: "Locking Server" }

		if (this.props.sceneData.close)
			electron.ipcRenderer.send('close-window')
	}
	render() {
		if (this.state.text == "Closing Server")
			setTimeout(()=>electron.ipcRenderer.send('hide-window'),0)

		return <div className="exp row-center">
			<p>{this.state.text}</p>
		</div>
	}
	componentDidMount() {
		if (!this.props.sceneData.close)
			this.openServer()
	}

	async openServer() {

		// Lock Server
		
		const currentHost = await DataBase.getCurrentHost()
		if (currentHost != DataBase.getUserId()) {
			if (currentHost == null) return changeScene(SceneLockServer)
			else return changeScene(SceneButtons)
		}
		
		// Open Server

		this.setState({ text: "Opening Server" })
		
		if (await DataBase.getCurrentHost() == DataBase.getUserId()) {
			const dir = path.resolve(git.baseDir, "Survival - Paper")
			const cp = childProcess.spawn('cmd', ['/c', `java -Xmx${DataBase.getMemory()}G -Xms${DataBase.getMemory()}G -jar server.jar gui`], { cwd: dir })
			// cp.stdout.on("data", this.cpReceive.bind(this))

			setTimeout(() => {
				this.setState({ text: "Closing Server" })
			}, 6000)

			await new Promise((resolve) => {
				cp.on("close", () => {
					electron.ipcRenderer.send('show-window')
					resolve()
				})
			})

			return changeScene(SceneUnlockServer, { close: true })
		} else {
			return changeScene(SceneButtons)
		}
	}
}