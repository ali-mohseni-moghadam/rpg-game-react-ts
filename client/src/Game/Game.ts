import {
  Engine,
  HavokPlugin,
  Observable,
  Scene,
  Vector3,
} from "@babylonjs/core";
import Debugger from "./Debugger";
import Environment from "./Environment";
import Camera from "./Camera";
import Grounds from "./Ground";
// import useStore from "../store/index.store";
// import Tree from "./Tree";
import HavokPhysics from "@babylonjs/havok";
import Network from "./Network";
import OnKeyboard from "./OnKeyboard";
import TextMesh from "./TextMesh";
// import Player from "./Player";

export default class Game {
  private static instance: Game | undefined;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Game();
    }
    return this.instance;
  }

  static clearInstance() {
    this.instance?.cleanUp();
    this.instance = undefined;
  }

  canvas!: HTMLCanvasElement;
  engine!: Engine;
  scene!: Scene;
  camera!: Camera;
  cleanUpObservable = new Observable();
  resizeObservable = new Observable();
  isInitialized = false;

  // tree!: Tree
  textMesh!: TextMesh;
  keyboardHandler!: OnKeyboard;
  // player!: Player;

  async init(canvas: HTMLCanvasElement) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.canvas = canvas;

    this.engine = new Engine(canvas, true, {
      lockstepMaxSteps: 4,
      deterministicLockstep: true,
    });

    this.scene = new Scene(this.engine);

    await this.initPhysics();

    window.addEventListener("resize", this.onResize.bind(this));

    this.camera = new Camera();

    new Environment();
    new Grounds();

    if (process.env.NODE_ENV === "development") {
      const debugLayer = new Debugger();
      await debugLayer.init();
    }

    // this.tree = new Tree();
    this.keyboardHandler = new OnKeyboard();
    this.textMesh = new TextMesh();
    // this.player = new Player();

    Network.getInstance().connectSocket();

    await this.scene.whenReadyAsync();

    // let test = 0;
    // setInterval(() => {
    //   const { setTest } = useStore.getState();
    //   test++
    //   setTest(test);
    // }, 1000);

    this.engine.runRenderLoop(() => this.scene.render());
  }

  private onResize() {
    this.engine.resize();
    this.resizeObservable.notifyObservers(undefined);
  }

  async initPhysics() {
    const hk = await HavokPhysics();
    const gravityVector = new Vector3(0, -9.8, 0);
    const physicsPlugin = new HavokPlugin(true, hk);
    this.scene.enablePhysics(gravityVector, physicsPlugin);
  }

  cleanUp() {
    this.engine.stopRenderLoop();

    window.removeEventListener("resize", this.onResize.bind(this));
    this.cleanUpObservable.notifyObservers(undefined);

    this.engine.dispose();
  }
}
