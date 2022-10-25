import childProcess from "child_process"
import React from "react"
import { changeScene } from ".."
import * as DataBase from "../DataBase"
import { SceneButtons } from "./Buttons"
import { SceneLockServer } from "./LockServer"
import { SceneUnlockServer } from "./UnlockServer"

import path from "path"

let mc_process = null;

export class SceneOpenServer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { text: "Locking Server" }

		if (this.props.sceneData.close)
			electron.ipcRenderer.send('close-window')
	}
	render() {
		// if (this.state.text == "Server Is Running")
		// 	setTimeout(()=>electron.ipcRenderer.send('hide-window'),0)

		if (mc_process) {
			return <div className="exp row-center">
				<p>{this.state.text}</p>
				<button style={{marginLeft: "20px"}} onClick={() => {
					if (mc_process) mc_process.stdin.write("stop\n");
					else {
						console.error("Server process has terminated without notifying");
						changeScene(SceneUnlockServer)
					}
				}}>Stop Server</button>
			</div>
		} else {
			return <div className="exp row-center">
				<p>{this.state.text}</p>
			</div>
		}
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
			mc_process = childProcess.spawn('cmd', ['/c', `java -Xmx${DataBase.getMemory()}G -Xms${DataBase.getMemory()}G -jar server.jar nogui`], { cwd: dir })
			mc_process.stdout.on("data", b => console.log(b.toString()))

			setTimeout(() => {
				this.setState({ text: "Server Is Running" })
			}, 6000)

			await new Promise((resolve) => {
				mc_process.on("close", () => {
					electron.ipcRenderer.send('show-window')
					resolve()
				})
			})

			mc_process = null;
			return changeScene(SceneUnlockServer, { close: true })
		} else {
			return changeScene(SceneButtons)
		}
	}
}