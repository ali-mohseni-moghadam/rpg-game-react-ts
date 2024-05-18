import {
  AbstractMesh,
  CreatePlane,
  Mesh,
  Nullable,
  Scene,
  Vector3,
} from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export default class TextMesh {
  createText(
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
}
