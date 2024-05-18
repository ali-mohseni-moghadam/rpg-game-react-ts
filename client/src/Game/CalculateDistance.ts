import { Vector3 } from "@babylonjs/core";

export default class CalculateDistance {
  CreateCaculator(targetPosition: Vector3, ourPosition: Vector3) {
    return Vector3.Distance(targetPosition, ourPosition);
  }
}
