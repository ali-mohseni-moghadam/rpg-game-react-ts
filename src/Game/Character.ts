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
import Game from "./Game";

export default class Character {
  scene: Scene;
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

      this.animation = model.animationGroups;

      const meshes = model.meshes;
      const rootMesh = meshes[0];
      this.characterBox = CreateBox(
        "characterBox",
        {
          size: 1,
          height: 2,
        },
        this.scene
      );
      rootMesh.parent = this.characterBox;
      this.characterBox.visibility = 0;
      rootMesh.position.y = -1;
      this.characterBox.position.y += 1;

      this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));
    } catch (error) {
      console.log(`error happend ${error}`);
    }
  }

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
}
