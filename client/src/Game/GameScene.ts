import { Scene, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class GameScene {
  scene: Scene;

  constructor() {
    this.scene = Game.getInstance().scene;

    this.scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  update() {
    // variables
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime() / 1000;

    const player = Game.getInstance().player;

    const camHorizontal = Game.getInstance().keyboardHandler.camHorizontal;
    const camVertical = Game.getInstance().keyboardHandler.camVertical;

    const cameraContainer = Game.getInstance().camera.cameraContainer;
    const camSpeed = 10;

    const ourTargetPosition = Game.getInstance().movePlayer.ourTargetPosition;

    const targetName = Game.getInstance().movePlayer.targetName;

    const direction = Game.getInstance().movePlayer.direction;

    const stopPlayer = Game.getInstance().stopPlayer;

    // functionality

    player.characterAggregate.body.setLinearVelocity(direction);

    cameraContainer.locallyTranslate(
      new Vector3(
        camHorizontal * camSpeed * delta,
        0,
        camVertical * camSpeed * delta
      )
    );

    if (!ourTargetPosition) return;
    const { x, z } = ourTargetPosition;
    player.characterBox.lookAt(
      new Vector3(x, player.characterBox.position.y, z),
      0,
      0,
      0
    );

    player.characterBox.rotation.y += Math.PI;

    if (ourTargetPosition) {
      const distance = Game.getInstance().calculateDistannce.CreateCaculator(
        ourTargetPosition,
        player.characterBox.position
      );

      if (targetName === "base_ground" || targetName === "tree") {
        if (distance < 0.5) return stopPlayer.stop();
      }
    }
  }
}
