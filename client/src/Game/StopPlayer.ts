import { Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class StopPlayer {
  ourTargetPosition: Vector3 | undefined;

  direction: Vector3;

  constructor() {
    this.ourTargetPosition = Game.getInstance().movePlayer.ourTargetPosition;

    this.direction = Game.getInstance().movePlayer.direction;
  }
  stop() {
    const animation = Game.getInstance().player.animation;

    animation.forEach((anim) => anim.name === "running" && anim.stop());
    animation.forEach((anim) => anim.name === "attack" && anim.stop());
    animation.forEach((anim) => anim.name === "idle" && anim.play(true));
    this.ourTargetPosition = undefined;
    this.direction.set(0, 0, 0);
  }
}
