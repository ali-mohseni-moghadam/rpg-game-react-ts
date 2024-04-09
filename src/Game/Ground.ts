import {
  Color3,
  CreateGround,
  Mesh,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

export default class Grounds {
  ground: Mesh;
  constructor() {
    this.ground = CreateGround("base_ground", {
      width: 50,
      height: 50,
    });

    const groundMaterial = new StandardMaterial("groundMaterial");

    const diffTexture = new Texture("../rocky_diff.jpg");
    const normalTex = new Texture("../rocky_nor.jpg");

    groundMaterial.diffuseTexture = diffTexture;
    groundMaterial.bumpTexture = normalTex;

    diffTexture.uScale = 8;
    diffTexture.vScale = 8;
    normalTex.uScale = 8;
    normalTex.vScale = 8;

    // groundMaterial.specularColor = new Color3(0, 0, 0);

    this.ground.material = groundMaterial;
  }
}
