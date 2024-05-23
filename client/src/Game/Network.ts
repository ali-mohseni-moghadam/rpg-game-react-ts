import { io, Socket } from "socket.io-client";
import Enemy from "./Enemy";
import { Vector3 } from "@babylonjs/core";
import Player from "./Player";

type playerData = {
  id: string;
  position: {
    x: number;
    z: number;
  };
};

export default class Network {
  private static instance: Network | undefined;

  socket!: Socket;

  isPlayerCreated = false;

  enemy = new Map();

  static getInstance() {
    if (!this.instance) {
      this.instance = new Network();
    }
    return this.instance;
  }

  connectSocket() {
    this.socket = io("http://localhost:5000/");

    this.socket.on("updatePlayers", (players: playerData[]) => {
      players.forEach((item: playerData) => {
        if (item.id === this.socket.id) {
          if (this.isPlayerCreated) return;
          const player = new Player();
          this.isPlayerCreated = true;
          this.enemy.set(item.id, player);
        } else if (!this.enemy.has(item.id)) {
          const enemy = new Enemy(
            new Vector3(item.position.x, 1, item.position.z)
          );
          this.enemy.set(item.id, enemy);
        }
      });
    });

    console.log(this.enemy);
  }

  sendPosition(posX: number, posY: number) {
    if (this.socket) {
      this.socket.emit("update", {
        positionX: posX,
        positionZ: posY,
      });
    }
  }
}
