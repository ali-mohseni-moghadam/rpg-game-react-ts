import { io, Socket } from "socket.io-client";
import Enemy from "./Enemy";
import Player from "./Player";
import { Vector3 } from "@babylonjs/core";

type playerData = {
  id: string;
  position: {
    x: number;
    z: number;
  };
  enemyAnimation: string;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

export default class Network {
  private static instance: Network | undefined;

  socket!: Socket;

  isPlayerCreated = false;

  characters = new Map<string, Enemy>();

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
          new Player();
          this.isPlayerCreated = true;
        } else if (!this.characters.has(item.id)) {
          const enemy = new Enemy();
          this.characters.set(item.id, enemy);
        }
      });

      // delete players
    });

    this.socket.on("updatePosition", (players: playerData[]) => {
      players.forEach((item: playerData) => {
        if (this.socket.id !== item.id) {
          const enemy = this.characters.get(item.id);
          if (!enemy) return;
          if (!enemy.characterBox) return;
          enemy.characterBox.position.set(item.position.x, 1, item.position.z);
          enemy.animation.forEach((anim) => {
            if (anim.name === item.enemyAnimation) {
              anim.play(true);
            } else {
              anim.stop();
            }
          });
          enemy.characterBox.lookAt(
            new Vector3(item.rotationX, item.rotationY, item.rotationZ)
          );
          enemy.characterBox.rotation.y += Math.PI;
        }
      });
    });
  }

  sendData(
    posX: number,
    posZ: number,
    animationName: string,
    rotationX: number,
    rotationY: number,
    rotationZ: number
  ) {
    if (this.socket) {
      this.socket.emit("update", {
        x: posX,
        z: posZ,
        animationName,
        rotationX: rotationX,
        rotationY: rotationY,
        rotationZ: rotationZ,
      });
    }
  }
}
