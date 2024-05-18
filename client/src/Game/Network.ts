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

    this.socket.on("message", (data) => {
      console.log(`Received message from the server: ${data}`);
    });

    this.socket.emit("message", "Hello from the client!");

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }
}
