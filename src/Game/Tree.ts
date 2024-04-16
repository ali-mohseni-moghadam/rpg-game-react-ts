import {
  AbstractMesh,
  Mesh,
  Nullable,
  Scalar,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import Game from "./Game";

export default class Tree {
  scene: Scene;
  createTextMesh: (
    textToDisplay: string,
    color: string,
    scene: Scene,
    theParent: Nullable<AbstractMesh>,
    posY: number
  ) => Mesh;
  constructor() {
    this.scene = Game.getInstance().scene;
    this.createTextMesh = Game.getInstance().gameScene.createTextMesh;
    this.createTree();
  }

  async createTree() {
    const mainTree = await SceneLoader.ImportMeshAsync(
      "",
      "../",
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
      this.createTextMesh("Tree", "brown", this.scene, treeClone, 4.9);
      if (treeClone) treeClone.position = new Vector3(randomX, 0, randomY);
    }

    tree.dispose();
  }
}
