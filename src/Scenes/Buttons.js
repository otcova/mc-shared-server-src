import React from "react"
import { changeScene } from ".."
import * as DataBase from "../DataBase"
import { git, gitCloneProgress } from "../git"
import { SceneConfig } from "./Config"
import { SceneLockServer } from "./LockServer"
import { SceneOpenServer } from "./OpenServer"
import { SceneUnlockServer } from "./UnlockServer"

export class SceneButtons extends React.Component {

	constructor(props) {
		super(props)
		this.updateButtons = this.updateButtons.bind(this)

		this.state = {}

		document.addEventListener("host-change", this.updateButtons)
	}
	componentWillUnmount() {
		document.removeEventListener("host-change", this.updateButtons)
		if (this.timerA) clearTimeout(this.timerA)
		if (this.timerB) clearTimeout(this.timerB)
	}
	render() {
		if (this.state.downloadingWorld)
			this.timerA = setTimeout(this.updateButtons, 1000);

		return <div className="exp row-center">
			{this.state.loading ? <p>Loading...</p> : ""}
			{this.state.online ? <p style={{ marginRight: 20 }}>Current Host: {this.state.online}</p> : ""}
			{this.state.downloadingWorld ? <div className="column"><p>Downloading World</p><span>{gitCloneProgress}</span></div> : ""}
			{this.state.lockServer ? <button onClick={e => { changeScene(SceneLockServer) }}>Lock Server</button> : ""}
			{this.state.unlockServer ? <button onClick={e => { changeScene(SceneUnlockServer) }}>Unlock Server</button> : ""}
			{this.state.openServer ? <button onClick={e => { changeScene(SceneOpenServer) }}>Open Server</button> : ""}
			{this.state.config ? <button onClick={e => { changeScene(SceneConfig) }}>Config</button> : ""}
		</div>;
	}

	componentDidMount() {
		this.timerB = setTimeout(() => {
			if (this.state.loading === undefined)
				this.setState({ loading: true })
		}, 500)
		this.updateButtons()
	}

	async updateButtons() {

		const newState = {
			loading: false,
			online: false,
			config: false,
			openServer: false,
			downloadingWorld: false,

			lockServer: false,
			unlockServer: false,
		}
		
		if (git == undefined) {
			newState.downloadingWorld = true;
			this.setState(newState)
			return
		}

		if (!DataBase.getUserId()) {
			changeScene(SceneConfig)
			return
		}

		const currentHost = await DataBase.getCurrentHost()
		if (typeof currentHost == "string" && currentHost != DataBase.getUserId()) {
			newState.online = currentHost;
			newState.config = true;
			this.setState(newState)
		} else {
			newState.openServer = true;
			if (DataBase.getUserId() == await DataBase.getCurrentHost()) {
				newState.unlockServer = true;
			}
			else {
				newState.lockServer = true;
				newState.config = true;
			}
			this.setState(newState)
		}
	}
}