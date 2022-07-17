import firebase from 'firebase/app'
import "firebase/analytics"
import "firebase/database"

//// FireBase
const app = firebase.initializeApp({
	apiKey: "AIzaSyBjcksly1jLIkCibFp9kSyUvOV4dI-3XXU",
	authDomain: "mc-shared-server.firebaseapp.com",
	databaseURL: "https://mc-shared-server-default-rtdb.firebaseio.com",
	projectId: "mc-shared-server",
	storageBucket: "mc-shared-server.appspot.com",
	messagingSenderId: "307194017845",
	appId: "1:307194017845:web:2e32c0f57bae2e31fd597c",
	measurementId: "G-7YQY5W1QGW"
})
firebase.analytics()

const database = firebase.database()
const currentHostRef = firebase.database().ref('CurrentHost')

currentHostRef.on("value", (snapshot) => {
	document.dispatchEvent(new Event("host-change"))
	// const hostListObj = snapshot.val();
	// if (hostListObj == null) callback(null);
	// else {
	// 	const hostList = Object.values(hostListObj);
	// 	if (hostList.length == 1) callback(hostList[0]);
	// }
})

export async function getCurrentHost() {

	const hostListObj = (await currentHostRef.get()).val()
	if (hostListObj == null) return null

	const hostList = Object.values(hostListObj)

	if (hostList.length == 0) return null
	return hostList[0]
}

export async function startHost() {
	const userId = getUserId();

	if ((await currentHostRef.get()).val() == null) {

		await currentHostRef.push().set(userId)
		const hostListObj = (await currentHostRef.get()).val()

		if (hostListObj != null) {
			const hostList = Object.values(hostListObj);
			if (hostList.length == 1 && hostList[0] == userId) return "success"
		}
	}

	return "error"
}
window.stopHost = stopHost;
export async function stopHost() {
	const currentHost = await getCurrentHost();
	if (currentHost == getUserId()) {
		await currentHostRef.remove();
		return "success"
	}
	return "error"
}

//// Local Storage

export function getUserId() {
	return localStorage.getItem("userId");
}
export function setUserId(userId) {
	localStorage.setItem("userId", userId);
}

export function getMemory() {
	if (localStorage.getItem("memory") == null) setMemory("3")
	return localStorage.getItem("memory");
}
export function setMemory(userId) {
	localStorage.setItem("memory", userId);
}
