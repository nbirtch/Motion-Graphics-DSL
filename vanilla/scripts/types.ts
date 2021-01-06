import { Animation } from './animation'
import { Element } from './object'

export type Context = {
  objects: Map<string, Element>
  animations: Map<string, Animation>
  container: HTMLElement
}
