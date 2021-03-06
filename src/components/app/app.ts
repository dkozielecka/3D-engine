import "./app.scss";
import { Color } from "three";
import { ThreeDBuilder } from "../_modules/3D/threeDBuilder/ThreeDBuilder";

class WorkSpace {
  threeEngine: ThreeDBuilder;

  constructor() {}

  initialize() {
    this.initSandbox();
    this.threeEngine
      .run()
      .createPrism()
      .addEgdesClicker()
      .addMouseRotator()
      .addFaceClicker({
        colorClickedFace: new Color(0xd2ff4d)
      });

    // TODO: Move this to the game: Checking if sides are properly clicked:
    let engine = this.threeEngine;
    setInterval(function () {console.log("bottom faces: " + engine.areAllBottomFacesClicked())}, 2000);
    setInterval(function () {console.log("side faces: " + engine.areAllSideFacesClicked())}, 2000);
  }

  private initSandbox() {
    this.threeEngine = new ThreeDBuilder({
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
const workspace = new WorkSpace();
workspace.initialize();
