import { IPointerEvent, Scene, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class MovePlayer {
  scene!: Scene;

  targetName!: string;

  direction: Vector3 = Vector3.Zero();

  ourTargetPosition!: Vector3 | undefined;

  constructor() {
    this.scene = Game.getInstance().scene;

    this.scene.onPointerDown = (event: IPointerEvent) => {
      this.move(event);
    };
  }

  move(event: IPointerEvent) {
    const characterBox = Game.getInstance().player.characterBox;
    if (!characterBox) return;
    const runPlayer = Game.getInstance().runPlayer;
    const stopPlayer = Game.getInstance().stopPlayer;

    if (!characterBox) return;
    if (event.buttons === 1) {
      const pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      if (!pickInfo.hit) return;
      if (!pickInfo.pickedPoint) return;
      if (!pickInfo.pickedMesh) return;

      this.targetName = pickInfo.pickedMesh.name;
      console.log(this.targetName);

      pickInfo.pickedPoint.y = characterBox.position.y;
      this.ourTargetPosition = pickInfo.pickedPoint;

      this.direction = this.ourTargetPosition.subtract(characterBox.position);
      this.direction.normalize();
      this.direction.scale(4);

      const distance = Game.getInstance().calculateDistannce.CreateCaculator(
        this.ourTargetPosition,
        characterBox.position
      );

      if (this.targetName === "base_ground") {
        if (this.direction) runPlayer.run();
        if (distance < 1) return console.log("we are near our target");
      }
      if (this.targetName === "tree") {
        if (this.direction) runPlayer.run();
        if (distance < 1) stopPlayer.stop();
      }
    }
  }
}
