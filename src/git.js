
import os from "os"
import path from "path"
import fs from "fs"

import simpleGit from "simple-git"

class Git {
	constructor(baseDir) {
		
		this.progressEvents = {}
		this.baseDir = baseDir
		
		this.git = simpleGit({ baseDir, progress: 
			(({ method, stage, progress }) => {
				console.log(`Git.${method} - [${stage}] ${progress}%`)
				if (this.progressEvents[method])
					this.progressEvents[method](`${stage} ${progress}%`)
			}).bind(this)
		});
		
		if (baseDir) {
			console.log("New Git on", baseDir)
			git = this
			window.git = git;
		}
	}

	async #progressHandler(method, handler, endPromise) {
		console.log("Run Git."+method)
		this.progressEvents[method] = handler
		const result = await endPromise()
		this.progressEvents[method] = null
		return result
	}
	
	async add(progressHandler) {
		return await this.#progressHandler("add", progressHandler, () => this.git.add(".", '--progress'))
	}
	async commit(msg) {
		return await this.git.commit(msg)
	}
	async pull(progressHandler) {
		return await this.#progressHandler("pull", progressHandler, () => this.git.pull())
	}
	async push(progressHandler) {
		return await this.#progressHandler("push", progressHandler, () => this.git.push())
	}
	async clone(repoUrl, path, progressHandler) {
		return await this.#progressHandler("clone", progressHandler, () => this.git.clone(repoUrl, path))
	}
	status() {
		return this.git.status()
	}
}

export let git = undefined
export let gitCloneProgress = ""

const serverDir = path.resolve(os.homedir(), "Documents", "MC Shared Server", "Worlds", "default")
if (!fs.existsSync(serverDir, {recursive: true})) fs.mkdirSync(serverDir, {recursive: true});

if (!fs.existsSync(path.resolve(serverDir, ".git")) || !fs.existsSync(path.resolve(serverDir, "Survival - Paper"))) {
	if (!fs.existsSync(path.resolve(serverDir, "Survival - Paper"))) {
		fs.rmdirSync(path.resolve(serverDir, ".git"), {recursive: true})
	}
	(new Git()).clone("https://github.com/otcova/mc-shared-server.git", serverDir, progress => {
		gitCloneProgress = progress
	}).then(result => {
		setTimeout(()=>{
			console.log("Git Clone Done")
			new Git(serverDir)
			gitCloneProgress = "done"
		}, 1000)
	})
} else {
	new Git(serverDir)
	gitCloneProgress = "done"
}