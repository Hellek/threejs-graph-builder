import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
import { ColorsData, Coordinates } from "./getData"
// import { MapControls } from 'three/examples/jsm/controls/MapControls';

interface GDConstructorProps {
  container: HTMLDivElement
  tree: Coordinates
  scatter: Coordinates
  colors: ColorsData,
}

export class GraphDrawer {
  container: HTMLDivElement
  camera: OrthographicCamera
  scene: Scene
  renderer: WebGLRenderer
  // controls: MapControls
  readonly Z = 1000

  constructor({
    container,
    tree,
    scatter,
    colors,
  }: GDConstructorProps) {
    this.container = container
    container.style.overflow = 'hidden' // HACK Remove unexpected scrollbars

    const { x, y, z } = this.getCenter(scatter) // initial center
    this.camera = new OrthographicCamera(-x * 1.1, x * 1.1, y * 1.1, -y * 1.1)
    this.camera.position.set(x, y, z);

    this.scene = new Scene()
    this.scene.background = new Color(0x222222);
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.setRendererSize()
    container.appendChild(this.renderer.domElement);

    // this.controls = new MapControls(this.camera, this.renderer.domElement);

    this.drawTree(tree)
    this.drawScatter(scatter, colors)

    // this.controls.addEventListener('change', this.render);
    window.addEventListener('resize', this.onWindowResize);

    this.render()
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  }

  drawTree(tree: Coordinates) {
    const material = new LineBasicMaterial({ color: 0x666666 });

    for (let i = 0; i < tree.x.length; i += 2) {
      const points = [
        new Vector3(tree.x[i], tree.y[i], 0),
        new Vector3(tree.x[i + 1], tree.y[i + 1], 0),
      ]

      const geometry = new BufferGeometry().setFromPoints(points);

      const line = new Line(geometry, material);

      this.scene.add(line);
    }
  }

  drawScatter(scatter: Coordinates, colors: ColorsData) {
    const geometry = new BufferGeometry()
    const coloring = []

    const material = new PointsMaterial({
      size: 25,
      vertexColors: true,
    });

    const positions = []

    for (let i = 0; i < scatter.x.length; i += 1) {
      positions.push(scatter.x[i], scatter.y[i], 0)
      coloring.push(colors.r[i] / 255, colors.g[i] / 255, colors.b[i] / 255);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(coloring, 3));

    geometry.computeBoundingSphere();

    const points = new Points(geometry, material)

    this.scene.add(points)
  }

  onWindowResize = () => {
    this.camera.updateProjectionMatrix()
    this.setRendererSize()
  }

  setRendererSize() {
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  getMinMax(arr: number[]) {
    const sorted = [...arr].sort()

    return {
      min: sorted[0],
      max: sorted[arr.length - 1],
    }
  }

  getCenter(coord: Coordinates) {
    const x = this.getMinMax(coord.x)
    const y = this.getMinMax(coord.y)
    const z = this.getMinMax([this.Z])

    return new Vector3(
      (x.min + x.max) / 2.0,
      (y.min + y.max) / 2.0,
      (z.min + z.max) / 2.0,
    )
  }
}
