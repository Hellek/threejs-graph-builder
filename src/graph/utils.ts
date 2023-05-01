import { BufferGeometry, Camera, Color, Line, LineBasicMaterial, PerspectiveCamera, Points, PointsMaterial, Scene, Vector3, WebGLRenderer } from "three"
import { Coordinates } from "./getData"

export const getMin = (arr: number[], other = Number.MAX_VALUE) => {
  let m = Number.MAX_VALUE

  for (let i = 0; i < arr.length; i += 1) if (arr[i] < m) m = arr[i]

  if (m < other) return m

  return other
}

export const getMax = (arr: number[], other = -Number.MAX_VALUE) => {
  let m = -Number.MAX_VALUE

  for (let i = 0; i < arr.length; i += 1) if (arr[i] > m) m = arr[i]

  if (m > other) return m

  return other
}

export const getCenter = (scatter: Coordinates) => {
  const maxX = getMax(scatter.x)
  const minX = getMin(scatter.x)
  const maxY = getMax(scatter.y)
  const minY = getMin(scatter.y)
  const maxZ = 0
  const minZ = 0

  return new Vector3(
    (maxX + minX) / 2.0,
    (maxY + minY) / 2.0,
    (maxZ + minZ) / 2.0,
  )
}

export const getInitials = ({
  screenWidth,
  screenHeight,
  container,
}: {
  screenWidth: number
  screenHeight: number
  container: HTMLDivElement
}) => {
  const VIEW_ANGLE = 45
  const ASPECT = screenWidth / screenHeight
  const NEAR = 0.1
  const FAR = 20000

  const camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)

  const scene = new Scene()
  scene.background = new Color(0x222222);
  scene.add(camera);

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(screenWidth, screenHeight);
  container.appendChild(renderer.domElement);

  return {
    scene,
    camera: new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR),
    renderer,
  }
}

export const setCamera = (
  scatter: Coordinates,
  camera: Camera,
) => {
  const center = getCenter(scatter)
  camera.position.set(0, 0, 1000);
  camera.lookAt(center);
}

export const drawTree = (scene: Scene, tree: Coordinates) => {
  const material = new LineBasicMaterial({ color: 0x666666 });

  for (let i = 0; i < tree.x.length; i += 2) {
    const points = [
      new Vector3(tree.x[i], tree.y[i], 0),
      new Vector3(tree.x[i + 1], tree.y[i + 1], 0),
    ]

    const geometry = new BufferGeometry().setFromPoints(points);

    const line = new Line(geometry, material);

    scene.add(line);
  }
}

export const drawScatter = (scene: Scene, scatter: Coordinates) => {
  const material = new PointsMaterial({
    color: 'yellow',
    size: 15,
    sizeAttenuation: true // what is it?
  });

  const points = []

  for (let i = 0; i < scatter.x.length; i += 1) {
    points.push(new Vector3(
      scatter.x[i],
      scatter.y[i],
      0, // scatter.z[i],
    ))
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const pointCloud = new Points(geometry, material)
  scene.add(pointCloud)
}
