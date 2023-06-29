import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { PointsColors, PointsCoordinates } from "./getData"

interface GDConstructorProps {
  container: HTMLDivElement
  tree: PointsCoordinates
  scatter: PointsCoordinates
  colors: PointsColors,
}

export class GraphDrawer {
  container: HTMLDivElement
  aspect: number
  camera: PerspectiveCamera
  scene: Scene
  renderer: WebGLRenderer
  readonly zMock = -1000

  constructor({
    container,
    tree,
    scatter,
    colors,
  }: GDConstructorProps) {
    this.container = container

    // Set initial camera
    const { x, y } = this.getCenter(scatter)
    // const { max: maxZ } = this.getMinMax(scatter.z)
    this.aspect = this.getAspect()
    this.camera = new PerspectiveCamera(45, this.aspect, 0.1, 20000)
    this.camera.position.set(x, y, this.zMock + 3000);

    // Create scene
    this.scene = new Scene()
    this.scene.background = new Color(0x222222)
    this.scene.add(this.camera);

    // Set renderer
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.setRendererSize()
    container.appendChild(this.renderer.domElement);

    // Configure controls
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enablePan = false
    // this.controls.enableRotate = false
    // Switch pan to left mouse button
    // this.controls.mouseButtons = { LEFT: MOUSE.PAN }
    // this.controls.maxDistance = maxZ * 25

    // Draw graph
    this.drawTree(tree)
    this.drawScatter(scatter, colors)

    this.initListeners()
  }

  initListeners() {
    window.addEventListener('resize', this.onWindowResize);
    // this.controls.addEventListener('change', this.render);
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  }

  drawTree(tree: PointsCoordinates) {
    const material = new LineBasicMaterial({ color: 0x666666 });

    for (let i = 0; i < tree.x.length; i += 2) {
      const points = [
        new Vector3(tree.x[i], tree.y[i], this.zMock),
        new Vector3(tree.x[i + 1], tree.y[i + 1], this.zMock),
      ]

      const geometry = new BufferGeometry().setFromPoints(points);

      const line = new Line(geometry, material);

      this.scene.add(line);
    }
  }

  drawScatter(scatter: PointsCoordinates, colors: PointsColors) {
    const geometry = new BufferGeometry()
    const coloring = []

    const material = new PointsMaterial({
      size: 25,
      vertexColors: true,
    });

    const positions = []

    for (let i = 0; i < scatter.x.length; i += 1) {
      positions.push(scatter.x[i], scatter.y[i], this.zMock)
      coloring.push(colors.r[i] / 255, colors.g[i] / 255, colors.b[i] / 255);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(coloring, 3));

    geometry.computeBoundingSphere();

    const points = new Points(geometry, material)

    this.scene.add(points)
  }

  // TODO fix scrollbar artifacts and graph stretching/smashing
  onWindowResize = () => {
    this.camera.aspect = this.getAspect()
    this.camera.updateProjectionMatrix()
    this.setRendererSize()
  }

  setRendererSize() {
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  getAspect() {
    return this.container.offsetWidth / this.container.offsetHeight
  }

  getMinMax(arr: number[]) {
    const sorted = [...arr].sort()

    return {
      min: sorted[0],
      max: sorted[arr.length - 1],
    }
  }

  getCenter(coord: PointsCoordinates) {
    const x = this.getMinMax(coord.x)
    const y = this.getMinMax(coord.y)

    return new Vector2(
      (x.min + x.max) / 2.0,
      (y.min + y.max) / 2.0,
    )
  }
}
