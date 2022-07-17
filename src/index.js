import React from "react"
import { render } from "react-dom"
import "./config"
import * as DataBase from "./DataBase"
import { SceneButtons } from "./Scenes/Buttons";

window.DataBase = DataBase

export let changeScene = null;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scene: SceneButtons,
			sceneData: {}
		}
		this.changeScene = this.changeScene.bind(this)
		changeScene = this.changeScene;
	}
	render() {
		return <Background>
			{<this.state.scene changeScene={this.changeScene} sceneData={this.state.sceneData||{}} pastScene={this.state.pastScene}/>}
		</Background>
	}
	changeScene(scene, sceneData) {
		console.log("Change to", scene.name);
		this.setState({scene: scene, sceneData: sceneData, pastScene: this.state.scene})
	}
}

function Background(props) {
	const padding = 10;
	const size = `-webkit-calc(100% - ${padding * 2}px)`;
	return <div className="no-drag colB" style={{ padding, width: size, height: size }}>
		<div className="exp drag colA">
			{props.children}
		</div>
	</div>
}

render(<App />, document.getElementById("root"))