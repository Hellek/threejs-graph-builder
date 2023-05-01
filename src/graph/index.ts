import { getColors, getData } from './getData';
import { drawScatter, drawTree, getInitials, setCamera } from './utils';

const { scatter, tree } = getData()
const colors = getColors()

export const initGraph = (container: HTMLDivElement) => {
  const { scene, camera, renderer } = getInitials({
    container,
  })

  drawTree(scene, tree)
  drawScatter(scene, scatter, colors)
  setCamera(scatter, camera)

  const animate = () => {
    // requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  // animate();
}
