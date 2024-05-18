import {
  AbstractMesh,
  AnimationGroup,
  CreateBox,
  Mesh,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";

import Game from "./Game";

import "@babylonjs/loaders";

export default class Player {
  rootMesh!: AbstractMesh;
  characterBox!: Mesh;
  characterAggregate!: PhysicsAggregate;

  animation!: AnimationGroup[];

  constructor() {
    this.createPlayer();
  }

  async createPlayer() {
    const scene = Game.getInstance().scene;
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
    const rootMesh = meshes[0];

    // character box
    this.characterBox = CreateBox("characterBox", {
      size: 1,
      height: 2,
    });
    rootMesh.parent = this.characterBox;
    this.characterBox.visibility = 0;
    rootMesh.position.y = -1;
    this.characterBox.position.y += 1;

    this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));

    // physics
    this.characterAggregate = new PhysicsAggregate(
      this.characterBox,
      PhysicsShapeType.BOX
    );

    this.characterAggregate.body.setMassProperties({
      mass: 1,
      inertia: Vector3.Zero(),
    });

    this.characterAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

    this.characterAggregate.shape.material.friction = 0;

    // name text
    const text = Game.getInstance().textMesh;
    text.createText("Ali", "White", scene, this.characterBox, 2);
  }
}
