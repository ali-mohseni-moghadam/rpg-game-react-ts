import { IPointerEvent, Vector3 } from "@babylonjs/core";
import CharacterBase from "./CharacterBase";
import Game from "./Game";
import Network from "./Network";

export default class Player extends CharacterBase {
  constructor() {
    super();

    this.scene.onPointerDown = (event: IPointerEvent) => {
      this.move(event);
    };

    this.scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  move(event: IPointerEvent) {
    this.isMoving = true;
    if (!this.characterBox) return;
    if (event.buttons === 1) {
      const pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      if (!pickInfo.hit) return;
      if (!pickInfo.pickedPoint) return;
      if (!pickInfo.pickedMesh) return;

      this.targetName = pickInfo.pickedMesh.name;

      pickInfo.pickedPoint.y = this.characterBox.position.y;
      this.ourTargetPosition = pickInfo.pickedPoint;

      this.direction = this.ourTargetPosition.subtract(
        this.characterBox.position
      );
      this.direction = this.direction.normalize();
      this.direction = this.direction.scale(4);

      this.distance = this.caculateDistance(
        this.ourTargetPosition,
        this.characterBox.position
      );

      if (this.targetName === "base_ground") {
        if (this.distance < 1) return console.log("we are near on our target");
        this.run();
      }

      if (this.targetName === "tree") {
        this.run();
      }
    }
  }

  update() {
    // variables
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime() / 1000;

    const camHorizontal = Game.getInstance().keyboardHandler.camHorizontal;
    const camVertical = Game.getInstance().keyboardHandler.camVertical;

    const cameraContainer = Game.getInstance().camera.cameraContainer;
    const camSpeed = 10;

    // functionality
    cameraContainer.locallyTranslate(
      new Vector3(
        camHorizontal * camSpeed * delta,
        0,
        camVertical * camSpeed * delta
      )
    );

    if (this.characterBox) {
      const network = Network.getInstance();
      network.sendPosition(
        this.characterBox.position.x,
        this.characterBox.position.z
      );
    }

    if (!this.ourTargetPosition) return;
    const targetVector = new Vector3(
      this.ourTargetPosition.x,
      this.characterBox.position.y,
      this.ourTargetPosition.z
    );
    this.characterBox.lookAt(targetVector);
    this.characterBox.rotation.y += Math.PI;

    if (this.direction && this.characterAggregate.body)
      this.characterAggregate.body.setLinearVelocity(this.direction);

    if (this.isMoving && this.ourTargetPosition !== undefined) {
      const distance = this.caculateDistance(
        this.ourTargetPosition,
        this.characterBox.position
      );
      if (this.targetName === "base_ground" && distance < 1) {
        this.stop();
      }
    }
  }
}
