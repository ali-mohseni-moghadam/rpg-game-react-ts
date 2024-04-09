import { Scalar, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export class Tree {
  scene: Scene;
  constructor() {
    this.scene = Game.getInstance().scene;
    this.createTree();
  }

  async createTree() {
    try {
      const mainTree = await SceneLoader.ImportMeshAsync(
        "",
        "../../",
        "Tree.glb",
        this.scene
      );

      if (!mainTree) return;

      const tree = mainTree.meshes[1];
      tree.parent = null;
      mainTree.meshes[0].dispose();

      let treeLength = 25;
      let radius = 25;

      for (let i = 0; i <= treeLength; i++) {
        const randomX = Scalar.RandomRange(-radius, radius);
        const randomY = Scalar.RandomRange(-radius, radius);

        const treeClone = tree.clone("tree", null);
        if (treeClone) treeClone.position = new Vector3(randomX, 0, randomY);
      }

      tree.dispose();
    } catch (error) {
      console.log(`error happend${error}`);
    }
  }
}
