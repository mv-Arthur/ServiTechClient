import { io, Socket } from "socket.io-client";
import { API_URL } from "../http";

export class SocketApi {
	static socket: null | Socket = null;

	static createConnection() {
		this.socket = io(API_URL); //may be add "/" symbol to end string api url

		this.socket.on("connect", () => {
			console.log("connect");
		});

		this.socket.on("disconnect", () => {
			console.log("disconnect");
		});
	}
}
