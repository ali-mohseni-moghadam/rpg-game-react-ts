import {
  AbstractMesh,
  Nullable,
  PhysicsAggregate,
  PhysicsShapeType,
  Scalar,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";

import Game from "./Game";

import "@babylonjs/loaders";
export default class Tree {
  treeArray: Nullable<AbstractMesh>[] = [];

  treeAggregate!: PhysicsAggregate;

  constructor() {
    this.createTree();
  }

  async createTree() {
    const scene = Game.getInstance().scene;

    const mainTree = await SceneLoader.ImportMeshAsync(
      "",
      "../models/",
      "Tree.glb",
      scene
    );

    if (!mainTree) return;

    const tree = mainTree.meshes[1];
    tree.parent = null;
    mainTree.meshes[0].dispose();

    this.treeAggregate = new PhysicsAggregate(
      tree,
      PhysicsShapeType.CYLINDER,
      { mass: 0 },
      scene
    );

    let treeLength = 25;
    let radius = 25;

    for (let i = 0; i <= treeLength; i++) {
      const randomX = Scalar.RandomRange(-radius, radius);
      const randomY = Scalar.RandomRange(-radius, radius);

      const treeClone = tree.clone("tree", null);

      if (!treeClone?.physicsBody) return;
      treeClone.physicsBody.disablePreStep = false;

      const text = Game.getInstance().textMesh;
      text.createText("Tree", "brown", scene, treeClone, 4.9);

      if (treeClone) treeClone.position = new Vector3(randomX, 0, randomY);
      this.treeArray.push(treeClone);
    }

    tree.dispose();
  }
}
