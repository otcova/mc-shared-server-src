import React from "react"
import { changeScene } from ".."
import * as DataBase from "../DataBase"
import { git } from "../git"

export class SceneUnlockServer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { text: "", progress: "" }
	}
	render() {
		return <div className="exp column-center">
			<p>{this.state.text}</p>
			<span>{this.state.progress}</span>
		</div>
	}
	componentDidMount() {
		this.saveAndUnlock()
	}
	
	async saveAndUnlock() {

		this.setState({ text: "Adding Changes" })
		await git.add(".", progress=>{
			this.setState({ progress })
		})

		this.setState({ text: "Creating World Snapshot", progress: "" })
		await git.commit("Host: " + DataBase.getUserId())

		this.setState({ text: "Uploading World" })
		await git.push(progress=>{
			this.setState({ progress })
		})

		this.setState({ text: "Unlocking Server", progress: "" })
		await DataBase.stopHost()

		changeScene(this.props.pastScene, this.props.sceneData)
	}
}