import { Vector3, FreeCamera, CreateGround, Mesh } from "@babylonjs/core";

export default class Camera {
  cameraContainer: Mesh;

  constructor() {
    const camera = new FreeCamera("camera", new Vector3(0, 0, -8));

    // Camera Container
    this.cameraContainer = CreateGround("ground", {
      width: 0.5,
      height: 0.5,
    });
    this.cameraContainer.position = new Vector3(0, 13, 0);
    camera.parent = this.cameraContainer;
    camera.setTarget(new Vector3(0, -10, 0));
  }
}
