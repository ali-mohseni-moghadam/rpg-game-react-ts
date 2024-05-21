import Game from "./Game";
import Player from "./Player";

export default class Enemy extends Player {
  constructor() {
    super();
  }
  override async createPlayer(): Promise<void> {
    await super.createPlayer();
    const text = Game.getInstance().textMesh;
    text.createText("Enemy", "red", this.scene, this.characterBox, 2);
  }
}
