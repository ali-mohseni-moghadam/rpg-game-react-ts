import {
  AbstractMesh,
  ActionManager,
  AnimationGroup,
  CreateBox,
  CreatePlane,
  ExecuteCodeAction,
  IPointerEvent,
  KeyboardInfo,
  Mesh,
  Nullable,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";
import Game from "./Game";

export default class GameScene {
  scene: Scene;

  camVertical: number = 0;
  camHorizontal: number = 0;
  camSpeed: number = 10;
  cameraContainer: Mesh;

  characterSpeed: number = 4;

  ourTargetPosition!: Vector3 | undefined;

  isMoving: boolean = false;
  isAttacking: boolean = false;
  targetName!: string;
  characterBox!: Mesh;
  animation!: AnimationGroup[];

  targetBox!: Mesh;
  characterAggregate!: PhysicsAggregate;

  direction: Vector3 = Vector3.Zero();

  rootMesh!: AbstractMesh;

  // targetId: number | undefined;

  constructor() {
    this.scene = Game.getInstance().scene;

    this.cameraContainer = Game.getInstance().camera.cameraContainer;

    this.loadCharcter();

    this.scene.onPointerDown = (event: IPointerEvent) => {
      this.movePlayer(event);
    };

    this.createTargetBox();

    this.scene.onKeyboardObservable.add(this.onKeyboard.bind(this));
    this.scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  onKeyboard(event: KeyboardInfo) {
    const { type, key } = event.event;

    type.toLowerCase();

    if (type !== "keydown" && type !== "keyup") return;

    if (type === "keydown") {
      if (key === "w") this.camVertical = 1;
      if (key === "s") this.camVertical = -1;
      if (key === "a") this.camHorizontal = -1;
      if (key === "d") this.camHorizontal = 1;
    }

    if (type === "keyup") {
      if (key === "w" || key === "s") this.camVertical = 0;
      if (key === "a" || key === "d") this.camHorizontal = 0;
    }
  }

  async loadCharcter() {
    const Model = await SceneLoader.ImportMeshAsync(
      "",
      "../",
      "character.glb",
      this.scene
    );
    if (!Model) return;

    this.animation = Model.animationGroups;

    const meshes = Model.meshes;
    this.rootMesh = meshes[0];
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
      undefined,
      this.scene
    );
    this.characterAggregate.body.setMassProperties({
      mass: 1,
      inertia: Vector3.Zero(),
    });
    this.characterAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);
    // console.log(this.characterAggregate.body.getMotionType());
    this.createTextMesh("Ali", "White", this.scene, this.characterBox, 2);
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

      this.targetName = pickInfo.pickedMesh.name;
      // this.targetId = pickInfo.pickedMesh.id;

      pickInfo.pickedPoint.y = this.characterBox.position.y;
      this.ourTargetPosition = pickInfo.pickedPoint;

      const distance = this.caculateDistance(
        this.ourTargetPosition,
        this.characterBox.position
      );

      this.direction = this.ourTargetPosition.subtract(
        this.characterBox.position
      );
      this.direction.normalize();
      this.direction = this.direction.scale(4);

      if (this.targetName === "base_ground") {
        if (distance < 1) return console.log("we are near our target");
        if (this.direction) this.run(this.ourTargetPosition);
      }
    }
  }

  run(ourTargetPosition: Vector3) {
    this.isMoving = true;
    this.isAttacking = false;

    if (!this.animation) return;
    this.animation.forEach((anim) => {
      if (anim.name === "idle" || anim.name === "attack") {
        anim.stop();
      } else if (anim.name === "running") {
        anim.play(true);
      }
    });
  }

  stop() {
    this.isMoving = false;
    this.animation.forEach((anim) => anim.name === "running" && anim.stop());
    this.animation.forEach((anim) => anim.name === "attack" && anim.stop());
    this.animation.forEach((anim) => anim.name === "idle" && anim.play(true));
    this.ourTargetPosition = undefined;
    this.direction.set(0, 0, 0);
  }

  caculateDistance(ourTargetPosition: Vector3, ourPosition: Vector3) {
    return Vector3.Distance(ourTargetPosition, ourPosition);
  }

  createTargetBox() {
    if (!this.characterBox) return;
    const targetBox = CreateBox(
      "targetbox",
      {
        size: 1,
        height: 1,
      },
      this.scene
    );
    targetBox.isPickable = false;
    targetBox.isVisible = false;
    targetBox.actionManager = new ActionManager(this.scene);
    targetBox.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: this.characterBox,
        },
        () => {
          this.stop();
        }
      )
    );
  }

  createTextMesh(
    textToDisplay: string,
    color: string,
    scene: Scene,
    theParent: Nullable<AbstractMesh>,
    posY: number
  ) {
    const nameId = `text${Math.random()}`;
    const nameMesh = CreatePlane(nameId, { size: 4 }, scene);
    nameMesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
    const textureForName = GUI.AdvancedDynamicTexture.CreateForMesh(nameMesh);
    nameMesh.isPickable = false;
    nameMesh.isVisible = true;

    const nameText = new GUI.TextBlock();
    nameText.text = textToDisplay;
    nameText.color = color;
    nameText.fontSize = 100;
    nameText.height = 50;
    nameText.width = 150;
    // nameText.background = "red";
    textureForName.addControl(nameText);

    nameMesh.parent = theParent;
    nameMesh.position = new Vector3(0, posY ? posY : 2, 0);

    return nameMesh;
  }

  update() {
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime() / 1000;

    this.characterAggregate.body.setLinearVelocity(this.direction);

    if (!this.ourTargetPosition) return;
    const { x, z } = this.ourTargetPosition;
    this.characterBox.lookAt(new Vector3(x, this.characterBox.position.y, z));
    this.characterBox.rotation.y += Math.PI;

    this.cameraContainer.locallyTranslate(
      new Vector3(
        this.camHorizontal * this.camSpeed * delta,
        0,
        this.camVertical * this.camSpeed * delta
      )
    );

    if (this.isMoving && this.ourTargetPosition) {
      const distance = this.caculateDistance(
        this.ourTargetPosition,
        this.characterBox.position
      );

      if (this.targetName === "base_ground") {
        if (distance < 1) return this.stop();
      }
    }
  }
}
