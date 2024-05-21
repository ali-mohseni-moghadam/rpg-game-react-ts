import {
  AbstractMesh,
  AnimationGroup,
  CreateBox,
  IPointerEvent,
  Mesh,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";

import Game from "./Game";

import "@babylonjs/loaders";
import Network from "./Network";

export default class Player {
  scene!: Scene;

  rootMesh!: AbstractMesh;
  characterBox!: Mesh;
  characterAggregate!: PhysicsAggregate;

  animation!: AnimationGroup[];

  ourTargetPosition: Vector3 | undefined;
  direction: Vector3 = Vector3.Zero();
  targetName!: string;

  distance!: number;

  isMoving: boolean = false;

  constructor() {
    this.scene = Game.getInstance().scene;

    this.createPlayer();

    this.scene.onPointerDown = (event: IPointerEvent) => {
      this.move(event);
    };

    this.scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  async createPlayer() {
    // import model
    const Model = await SceneLoader.ImportMeshAsync(
      "",
      "../models/",
      "character.glb"
    );
    if (!Model) return;

    // animation
    this.animation = Model.animationGroups;

    const meshes = Model.meshes;
    this.rootMesh = meshes[0];

    // character box
    this.characterBox = CreateBox(
      "characterBox",
      {
        size: 1,
        height: 2,
      },
      this.scene
    );
    this.rootMesh.parent = this.characterBox;
    this.characterBox.visibility = 0;
    this.rootMesh.position.y = -1;
    this.characterBox.position.y += 1;

    this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));

    // physics
    this.characterAggregate = new PhysicsAggregate(
      this.characterBox,
      PhysicsShapeType.BOX,
      {
        mass: 1,
        friction: 0,
      }
    );

    this.characterAggregate.body.setMassProperties({
      inertia: Vector3.Zero(),
    });

    this.characterAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
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

  run() {
    this.isMoving = true;
    if (!this.animation) return;
    this.animation.forEach((anim) => {
      if (anim.name === "idle") {
        anim.stop();
      } else if (anim.name === "running") {
        anim.play(true);
      }
    });
  }

  stop() {
    this.isMoving = false;
    this.animation.forEach((anim) => anim.name === "running" && anim.stop());
    this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));
    this.ourTargetPosition = undefined;
    this.direction.set(0, 0, 0);
    if (this.characterAggregate.body) {
      this.characterAggregate.body.setLinearVelocity(Vector3.Zero());
    }
  }

  caculateDistance(targetPosition: Vector3, ourPosition: Vector3) {
    return Vector3.Distance(targetPosition, ourPosition);
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
      network.sendPosition(this.characterBox.position);
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
