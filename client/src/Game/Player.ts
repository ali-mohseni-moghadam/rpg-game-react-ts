import { IPointerEvent, Vector3 } from "@babylonjs/core";
import CharacterBase from "./CharacterBase";
import Game from "./Game";
import Network from "./Network";

export default class Player extends CharacterBase {
  animName = "idle";

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
        if (this.distance < 1) {
          return console.log("we are near on our target");
        }
        this.run();
      }
      if (this.targetName === "tree") {
        this.run();
      }
    }
  }

  run() {
    this.isMoving = true;
    if (!this.animation) return;
    this.animation.forEach((anim) => {
      if (anim.name === "idle") {
        anim.stop();
      }
      if (anim.name === "running") {
        anim.play(true);
        this.animName = "running";
      }
    });
  }

  stop() {
    this.isMoving = false;
    this.animation.forEach((anim) => {
      if (anim.name === "running") {
        anim.stop();
      }
      if (anim.name === "idle") {
        anim.play(true);
      }
    });

    this.ourTargetPosition = undefined;
    this.direction.set(0, 0, 0);
    if (this.characterAggregate.body) {
      this.characterAggregate.body.setLinearVelocity(Vector3.Zero());
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

    if (!this.ourTargetPosition) return;
    const characterRotation = new Vector3(
      this.ourTargetPosition.x,
      this.characterBox.position.y,
      this.ourTargetPosition.z
    );
    this.characterBox.lookAt(characterRotation);
    this.characterBox.rotation.y += Math.PI;

    console.log("update log:", this.animName);
    if (this.characterBox && this.animName) {
      const network = Network.getInstance();

      network.sendData(
        this.characterBox.position.x,
        this.characterBox.position.z,
        this.animName,
        characterRotation.x,
        characterRotation.y,
        characterRotation.z
      );
    }

    if (this.direction && this.characterAggregate.body)
      this.characterAggregate.body.setLinearVelocity(this.direction);

    if (this.isMoving && this.ourTargetPosition !== undefined) {
      const distance = this.caculateDistance(
        this.ourTargetPosition,
        this.characterBox.position
      );
      if (this.targetName === "base_ground" && distance < 1) {
        this.animName = "idle";
        this.stop();
        return;
      }
    }
  }
}
