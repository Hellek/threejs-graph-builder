import './style.css'
import { initGraph } from './graph/index'

const mountingElement = document.querySelector<HTMLDivElement>('#app')!

initGraph(mountingElement)
