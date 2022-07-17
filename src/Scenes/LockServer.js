import React from "react"
import { changeScene } from ".."
import { git } from "../git"
import * as DataBase from "../DataBase"

export class SceneLockServer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { text: "Locking Server", progress: "" }
	}
	render() {
		return <div className="exp row-center">
			<p>{this.state.text}</p>
			<span>{this.state.progress}</span>
		</div>
	}
	componentDidMount() {
		this.updateAndLock()
	}

	async updateAndLock() {
		if (!(await DataBase.getCurrentHost())) {
			console.log("Locking ...")
			this.setState({ text: "Locking Server" })
			await DataBase.startHost()
		}
		
		
		this.setState({ text: "Downloading World Changes" })
		await git.pull(progress => {
			this.setState({progress})
		})
		
		changeScene(this.props.pastScene)
	}
}