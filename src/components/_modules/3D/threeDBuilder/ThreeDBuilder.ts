import {Scene, OrthographicCamera, WebGLRenderer, Mesh, Color, CylinderGeometry, Face3} from "three";
import { FaceClicker } from "../eventsHandlers/FaceClicker";
import { Prism } from "../prism/Prism";
import { EdgeClicker } from "../eventsHandlers/EdgeClicker";
import { MouseRotator } from "../eventsHandlers/MouseRotator";

export interface ThreeDBuilderConfig {
  canvasHeight: number;
  canvasWidth: number;
  cameraPosition?: [
    {
      x: number;
      y: number;
      z: number;
    }
  ];
  alphaBg?: boolean;
}

interface PrismConfig {
  prismWidth?: number;
  prismHeight?: number;
  verticesAmount?: number;
  sideColor?: Color;
  sideOpacity?: number;
  edgesColor?: Color;
  edgeThickness?: number;
  colorClickedFace?: Color;
}

export class ThreeDBuilder {
  private canvasHeight: number;
  private canvasWidth: number;
  private scene: Scene;
  private camera: any;
  private renderer: WebGLRenderer;
  private canvas: HTMLDivElement;
  private cameraPosition;
  private alphaBg: boolean;
  private mouseRotator: MouseRotator;
  private prism: Mesh;
  private edgeClicker: EdgeClicker;
  private prismWidth: number;
  private prismHeigth: number;
  private verticesAmount: number;
  private sideColor: Color;
  private sideOpacity: number;
  private edgesColor: Color;
  private edgeThickness: number;
  private faceClicker: FaceClicker;
  private colorClickedFace: Color;

  constructor(config: ThreeDBuilderConfig) {
    this.canvasHeight = config.canvasHeight;
    this.canvasWidth = config.canvasWidth;
    this.cameraPosition = config.cameraPosition
      ? config.cameraPosition
      : [{ x: 0.2, y: 10, z: 14 }];
    this.alphaBg = config.alphaBg ? config.alphaBg : true;
  }

  public run() {
    this.configCanvas();
    this.initSunbox();
    window.addEventListener("resize", this.onWindowResize());

    return this;
  }

  public createPrism(config: PrismConfig = {}) {
    if (this.scene === undefined) {
      throw new Error("You must 'RUN' word first");
    }
    this.prismWidth = config.prismWidth ? config.prismWidth : 5;
    this.prismHeigth = config.prismHeight ? config.prismHeight : 7;
    this.verticesAmount = config.verticesAmount ? config.verticesAmount : 4;
    this.sideColor = config.sideColor ? config.sideColor : new Color(0xF2E8A8);
    this.sideOpacity = config.sideOpacity ? config.sideOpacity : 0.9;
    this.edgesColor = config.edgesColor
      ? config.edgesColor
      : new Color(0x6F6472);
    this.edgeThickness = config.edgeThickness ? config.edgeThickness : 0.1;

    this.prism = new Prism({
      verticesAmount: this.verticesAmount,
      edgeThickness: this.edgeThickness,
      edgesColor: this.edgesColor,
      prismHeigth: this.prismHeigth,
      prismWidth: this.prismWidth,
      sideColor: this.sideColor,
      sideOpacity: this.sideOpacity
    }).initialize();

    this.scene.add(this.prism);

    this.camera.lookAt(this.scene.position);

    const render = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(render);
    };
    render();

    return this;
  }

  public addMouseRotator() {
    if (this.prism === undefined) {
      throw new Error("You must create 'PRISM' first");
    }

    this.mouseRotator = new MouseRotator({
      camera: this.camera,
      scene: this.scene,
      canvasHeight: this.canvasHeight,
      canvasWidth: this.canvasWidth
    });

    return this;
  }

  public addEgdesClicker() {
    if (this.prism === undefined) {
      throw new Error("You must create 'PRISM' first");
    }
    this.edgeClicker = new EdgeClicker(this.camera, this.scene, {
      canvasHeight: this.canvasHeight,
      canvasWidth: this.canvasWidth,
      defaultColor: this.edgesColor,
    });

    return this;
  }

  public addFaceClicker(config: PrismConfig = {}) {
    if (this.prism === undefined) {
      throw new Error("You must create 'PRISM' first");
    }

    this.colorClickedFace = config.colorClickedFace
      ? config.colorClickedFace
      : new Color(0x71CE49);

    this.faceClicker = new FaceClicker({
      camera: this.camera,
      scene: this.scene,
      canvasHeight: this.canvasHeight,
      canvasWidth: this.canvasWidth,
      renderer: this.renderer,
      colorClickedFace: this.colorClickedFace
    });
    return this;
  }

  public areAllBottomFacesClicked(): boolean {
    let clickedFaces: Face3[] = this.faceClicker.getClickedFaces(this.prism);
    let bottomFaces: Face3[] = this.faceClicker.getBottomFaces(this.prism);

    // Wrong number of faces has been clicked
    if (clickedFaces.length !== bottomFaces.length)
      return false;

    return clickedFaces.every(f => bottomFaces.includes(f));
  }

    public areAllSideFacesClicked(): boolean {
      let clickedFaces: Face3[] = this.faceClicker.getClickedFaces(this.prism);
      let sideFaces: Face3[] = this.faceClicker.getSideFaces(this.prism);

      // Wrong number of faces has been clicked
      if (clickedFaces.length !== sideFaces.length)
          return false;

      return clickedFaces.every(f => sideFaces.includes(f));
    }

  private configCanvas() {
    this.canvas = document.createElement("div");
    this.canvas.setAttribute("id", "canvas");
    document.body.appendChild(this.canvas);
  }

  private initSunbox() {
    this.scene = new Scene();

    const width = window.innerWidth / 24;
    const height = window.innerHeight / 24;

    this.camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000
    );

    this.cameraPosition.forEach(item => {
      this.camera.position.set(item.x, item.y, item.z);
    });

    this.renderer = new WebGLRenderer({
      alpha: this.alphaBg,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvas.appendChild(this.renderer.domElement);
  }
  private onWindowResize(): any {
    (this.camera.aspect = this.canvasWidth), this.canvasHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
  }
}
