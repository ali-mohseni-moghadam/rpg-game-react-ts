<<<<<<< HEAD
import { CreateBox, Scene, SceneLoader } from "@babylonjs/core";
=======
import {
  AnimationGroup,
  CreateBox,
  DeepImmutableObject,
  IPointerEvent,
  Mesh,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
>>>>>>> ca35be6 (move player with mouse | add movePlayer, run and caculate method)
import Game from "./Game";

export default class Character {
  scene: Scene;
<<<<<<< HEAD
  constructor() {
    this.scene = Game.getInstance().scene;
    this.loadCharcter();
=======
  characterBox!: Mesh;

  isMoving: boolean = false;
  isAttacking: boolean = false;
  animation!: AnimationGroup[];

  constructor() {
    this.scene = Game.getInstance().scene;

    this.loadCharcter();

    this.scene.onPointerDown = (event: IPointerEvent) => {
      this.movePlayer(event);
    };
>>>>>>> ca35be6 (move player with mouse | add movePlayer, run and caculate method)
  }

  async loadCharcter() {
    try {
      const model = await SceneLoader.ImportMeshAsync(
        "",
        "../../",
        "character.glb",
        this.scene
      );

      if (!model) return;

<<<<<<< HEAD
      const animation = model.animationGroups;

      const meshes = model.meshes;
      const rootMesh = meshes[0];
      const characterBox = CreateBox(
=======
      this.animation = model.animationGroups;

      const meshes = model.meshes;
      const rootMesh = meshes[0];
      this.characterBox = CreateBox(
>>>>>>> ca35be6 (move player with mouse | add movePlayer, run and caculate method)
        "characterBox",
        {
          size: 1,
          height: 2,
        },
        this.scene
      );
<<<<<<< HEAD
      rootMesh.parent = characterBox;
      characterBox.visibility = 0;
      rootMesh.position.y = -1;
      characterBox.position.y = 1;

      animation.forEach((anim) =>
        anim.name === "idle" ? anim.play(true) : null
      );
=======
      rootMesh.parent = this.characterBox;
      this.characterBox.visibility = 0;
      rootMesh.position.y = -1;
      this.characterBox.position.y += 1;

      this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));
>>>>>>> ca35be6 (move player with mouse | add movePlayer, run and caculate method)
    } catch (error) {
      console.log(`error happend ${error}`);
    }
  }
<<<<<<< HEAD
=======

  movePlayer(event: IPointerEvent) {
    if (!this.characterBox) return;
    if (event.buttons === 1) {
      const pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY
      );
      if (!pickInfo.hit) return;
      if (!pickInfo.pickedPoint) return;
      if (!pickInfo.pickedMesh) return;

      const targetName = pickInfo.pickedMesh.name;
      // const targetId = pickInfo.pickedMesh.id;

      pickInfo.pickedPoint.y = this.characterBox.position.y;
      const ourTargetPosition = pickInfo.pickedPoint;

      const distance = this.caculateDistance(
        ourTargetPosition,
        this.characterBox.position
      );

      if (targetName === "base_ground") {
        if (distance < 1) return console.log("we are near on our target");
        this.Run(ourTargetPosition);
      }
    }
  }

  caculateDistance(
    TargetPosition: DeepImmutableObject<Vector3>,
    ourPosition: DeepImmutableObject<Vector3>
  ) {
    return Vector3.Distance(TargetPosition, ourPosition);
  }

  Run(ourTargetPosition: Vector3) {
    this.isMoving = true;
    this.isAttacking = false;

    const { x, z } = ourTargetPosition;
    this.characterBox.lookAt(
      new Vector3(x, this.characterBox.position.y, z),
      0,
      0,
      0
    );

    if (!this.animation) return;
    this.animation.forEach(
      (anim) => anim.name === "running" && anim.play(true)
    );
  }
>>>>>>> ca35be6 (move player with mouse | add movePlayer, run and caculate method)
}
