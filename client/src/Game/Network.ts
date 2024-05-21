import { Vector3 } from "@babylonjs/core";
import { io, Socket } from "socket.io-client";

export default class Network {
  private static instance: Network | undefined;

  socket!: Socket;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Network();
    }
    return this.instance;
  }

  connectSocket() {
    this.socket = io("http://localhost:5000/");

    this.socket.on("connect", () => {
      console.log(`Connected to the server`);
    });

    this.socket.on("userConnected", (data) => {
      console.log(`User ${data.socketId} has connected`);
    });

    this.socket.on("position", (data) => {
      console.log(data);
    });

    this.socket.on("userDisconnected", (data) => {
      console.log(`User ${data.socketId} has disconnected`);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }

  sendPosition(position: Vector3) {
    if (this.socket) {
      this.socket.emit("position", {
        positionX: position.x,
        positionY: position.y,
        positionZ: position.z,
      });
    }
  }
}
