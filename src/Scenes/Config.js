import React from "react"
import * as DataBase from "../DataBase"
import { SceneButtons } from "./Buttons"

export class SceneConfig extends React.Component {
	constructor(props) {
		super(props)

		this.onChange = this.onChange.bind(this)
		this.memoryChange = this.memoryChange.bind(this)
		this.validateUserId = this.validateUserId.bind(this)

		this.state = { userId: DataBase.getUserId() || "", memory: DataBase.getMemory() }
	}

	render() {
		return <div className="exp row-center">
			<p style={{ marginLeft: "0.5em" }}>Name:</p>
			<input type="text" spellCheck="false" size={9} value={this.state.userId} onChange={this.onChange} />
			<p style={{ marginLeft: "0.5em" }}>Memory:</p>
			<select name="Memory" id="Memory" value={this.state.memory} onChange={this.memoryChange}>
				<option value="2">2 GB</option>
				<option value="3">3 GB</option>
				<option value="4">4 GB</option>
				<option value="5">5 GB</option>
				<option value="6">6 GB</option>
				<option value="7">7 GB</option>
				<option value="8">8 GB</option>
			</select>
			<button onClick={this.validateUserId}>Confirm</button>
		</div>;
	}

	onChange(e) {
		this.setState({ userId: e.target.value.replace(/#|\.|\$|\[|\]/g, "") })
	}
	memoryChange(e) {
		this.setState({ memory: e.target.value })
	}
	
	validateUserId() {
		if (this.state.userId.length > 1) {
			DataBase.setUserId(this.state.userId)
			DataBase.setMemory(this.state.memory)
			this.props.changeScene(SceneButtons)
		}
	}
}