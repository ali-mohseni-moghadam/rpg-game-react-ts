import { KeyboardInfo, Mesh, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class GameScene {
  camVertical: number = 0;
  camHorizontal: number = 0;
  camSpeed: number = 10;
  cameraContainer: Mesh;

  constructor() {
    const scene = Game.getInstance().scene;

    this.cameraContainer = Game.getInstance().camera.cameraContainer;

    scene.onKeyboardObservable.add(this.onKeyboard.bind(this));
    scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  onKeyboard(event: KeyboardInfo): number | undefined {
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

  update() {
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime() / 1000;

    this.cameraContainer.locallyTranslate(
      new Vector3(
        this.camHorizontal * this.camSpeed * delta,
        0,
        this.camVertical * this.camSpeed * delta
      )
    );
  }
}
