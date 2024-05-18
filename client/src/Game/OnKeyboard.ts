import { KeyboardInfo } from "@babylonjs/core";
import Game from "./Game";

export default class OnKeyboard {
  constructor() {
    const scene = Game.getInstance().scene;

    scene.onKeyboardObservable.add(this.getInputs.bind(this));
  }

  camVertical: number = 0;
  camHorizontal: number = 0;

  getInputs(event: KeyboardInfo) {
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
}
