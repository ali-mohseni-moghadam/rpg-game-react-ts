import {
  CreateBox,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import CharacterBase from "./CharacterBase";
import Game from "./Game";

export default class Enemy extends CharacterBase {
  constructor() {
    super();
  }

  async createPlayer(): Promise<void> {
    // import model
    const Model = await SceneLoader.ImportMeshAsync(
      "",
      "../models/",
      "enemy.glb"
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

    const text = Game.getInstance().textMesh;
    text.createText("Enemy", "red", this.scene, this.characterBox, 2);

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

    this.characterAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
    this.characterAggregate.body.disablePreStep = false;
  }
}
