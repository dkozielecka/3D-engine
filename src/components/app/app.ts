import "./app.scss";
import { ThreeDEngine } from "../_modules/3D/engine/ThreeDEngine";
import { Color } from "three";

class WorkSapce {
  threeEngine: ThreeDEngine;

  constructor() {}

  initialize() {
    this.initSandbox();
    this.threeEngine
      .run()
      .createPrism({
        prismWidth: 5,
        prismHeight: 7
      })
      .addEgdesClicker()
      .addMouseRotator()
      .addFaceClicker({
        colorClickedFace: new Color(0xd2ff4d)
      });
  }

  private initSandbox() {
    this.threeEngine = new ThreeDEngine({
      canvasHeight: window.innerHeight,
      canvasWidth: window.innerWidth,
      cameraPosition: [
        {
          x: 0,
          y: 10,
          z: 15
        }
      ]
    });
  }
}
const workspace = new WorkSapce();
workspace.initialize();
