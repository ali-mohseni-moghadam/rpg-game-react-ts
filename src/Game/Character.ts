import { CreateBox, Scene, SceneLoader } from "@babylonjs/core";
import Game from "./Game";

export default class Character {
  scene: Scene;
  constructor() {
    this.scene = Game.getInstance().scene;
    this.loadCharcter();
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

      const animation = model.animationGroups;

      const meshes = model.meshes;
      const rootMesh = meshes[0];
      const characterBox = CreateBox(
        "characterBox",
        {
          size: 1,
          height: 2,
        },
        this.scene
      );
      rootMesh.parent = characterBox;
      characterBox.visibility = 0;
      rootMesh.position.y = -1;
      characterBox.position.y = 1;

      animation.forEach((anim) =>
        anim.name === "idle" ? anim.play(true) : null
      );
    } catch (error) {
      console.log(`error happend ${error}`);
    }
  }
}
