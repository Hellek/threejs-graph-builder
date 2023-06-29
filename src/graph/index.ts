import { getColors, getData } from './getData';
import { GraphDrawer } from './GraphDrawer';

const { scatter, tree } = getData()
const colors = getColors()

export const initGraph = (container: HTMLDivElement) => {
  const graphDrawer = new GraphDrawer({
    container,
    tree,
    scatter,
    colors,
  })

  graphDrawer.render()
}
