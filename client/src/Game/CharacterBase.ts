import {
  AbstractMesh,
  AnimationGroup,
  CreateBox,
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

export default class CharacterBase {
  scene!: Scene;

  rootMesh!: AbstractMesh;
  characterBox!: Mesh;
  characterAggregate!: PhysicsAggregate;

  animation!: AnimationGroup[];

  distance!: number;

  isMoving: boolean = false;

  ourTargetPosition: Vector3 | undefined;
  direction: Vector3 = Vector3.Zero();
  targetName!: string;

  constructor() {
    this.scene = Game.getInstance().scene;

    this.createPlayer();
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

    Game.getInstance().textMesh.createText(
      "Hero",
      "green",
      this.scene,
      this.characterBox,
      2
    );

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
}
