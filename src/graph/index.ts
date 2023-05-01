import { getData } from './getData';
import { drawScatter, drawTree, getInitials, setCamera } from './utils';

const { scatter, tree } = getData()

export const initGraph = (container: HTMLDivElement) => {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const { scene, camera, renderer } = getInitials({
    screenHeight,
    screenWidth,
    container,
  })

  drawTree(scene, tree)
  drawScatter(scene, scatter)
  setCamera(scatter, camera)

  const animate = () => {
    // requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  // animate();
}
