import {
  CreateGround,
  Mesh,
  PhysicsAggregate,
  PhysicsShapeType,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";
import Game from "./Game";

export default class Grounds {
  ground: Mesh;
  groundAggregate: PhysicsAggregate;
  constructor() {
    this.ground = CreateGround("base_ground", {
      width: 50,
      height: 50,
    });

    const scene = Game.getInstance().scene;

    const groundMaterial = new StandardMaterial("groundMaterial");

    const diffTexture = new Texture("../material/rocky_diff.jpg");
    const normalTex = new Texture("../material/rocky_nor.jpg");

    groundMaterial.diffuseTexture = diffTexture;
    groundMaterial.bumpTexture = normalTex;

    diffTexture.uScale = 8;
    diffTexture.vScale = 8;
    normalTex.uScale = 8;
    normalTex.vScale = 8;

    // groundMaterial.specularColor = new Color3(0, 0, 0);

    this.ground.material = groundMaterial;

    this.groundAggregate = new PhysicsAggregate(
      this.ground,
      PhysicsShapeType.BOX,
      {
        mass: 0,
        friction: 0,
      },
      scene
    );
  }
}
