import { styler, transform } from 'popmotion'
import { Runner } from '../animation'
import { getHex } from '../utils/color'
import { Centroid } from '../config'
import Obj from '../object'
import { animations, objects } from '../exec'
import { container } from '../main'

export type DefaultAttrs = {
  x: number
  y: number
  fill: string
  opacity: number
}

const nonDomProps = new Set(['style', 'priority', 'shape'])

export default class Element<T extends DefaultAttrs = DefaultAttrs> {
  identifier: string
  domEl: SVGElement
  runner: Runner | null
  initial: T
  lastState: T
  velocity: number
  subject: ReturnType<typeof styler>
  hasShape: boolean = true

  static createSvgElement(tagName: string) {
    return document.createElementNS('http://www.w3.org/2000/svg', tagName)
  }

  constructor(identifier: string, el: SVGElement, initial: T) {
    this.identifier = identifier
    this.domEl = el
    this.runner = null
    this.initial = initial
    this.lastState = initial
    this.velocity = 0
    this.subject = styler(el)

    this.setAttributes(initial)
  }

  setAttributes(props: Record<string, string | number>) {
    for (const key in this.omitNonDomProps(props)) {
      let val = props[key]
      if (val !== undefined) {
        if (key === 'opacity') {
          this.subject.set(key, val)
        } else {
          if (key === 'fill') {
            if (val === 'currentColor') {
              val = '#000'
            }
            val = getHex(val as string)
          }
          this.domEl.setAttribute(key, String(val))
        }
      }
    }
  }

  newShape(props: any): Element {
    let obj: Element = this
    if (props.shape && !this.hasShape) {
      const context = { animations, objects, container }

      Obj.remove(this.identifier, context)
      const newObj = Obj.create(
        {
          ...this.initial,
          ...props,
        },
        this.identifier,
        context
      )
      newObj.setDefaultAttributes({
        ...this.initial,
        ...props,
      })
      
      obj = newObj
    }
    container.removeChild(obj.domEl)
    objects.delete(obj.identifier)
    return obj
  }

  setDefaultAttributes(props: any): Record<string, string> {
    const newProps = { shape: props.shape } as Record<string, string>
    for (const key in this.omitNonDomProps(props)) {
      let val = props[key]
      if (val !== undefined) {
        if (key === 'opacity' && !this.subject.get('opacity')) {
          this.subject.set(key, val)
        } else {
          if (key === 'fill') {
            if (val === 'currentColor') {
              val = '#000'
            }
            val = getHex(val as string)
          }
          this.setDomElAttribute(key, String(val))
        }
        newProps[key] = String(val)
      }
    }
    return newProps
  }

  setDomElAttribute(key: string, val: string) {
    const isNewValue = !this.isDefaultValue(key, val)
    switch(key) {
      case 'x':
      case 'y':
        if (this.isDefaultValue(key, this.get(key)) && isNewValue) {
          this.domEl.setAttribute(key, val)
        }
        break
      case 'fill':
        if (this.isDefaultValue(key, getHex(this.fill)) && isNewValue) {
          this.domEl.setAttribute(key, val)
        }
        break
      default:
        if (!this.get(key)) {
          this.domEl.setAttribute(key, val)
        }
        break
    }
  }

  update(props: Record<string, string | number>) {
    this.subject.set(props)
  }

  get(prop: string): number | undefined {
    if (prop === 'scale') {
      const transform = this.domEl.style.transform
      return parseFloat(transform.split(`scale(`)[1])
    }

    const val = this.subject.get(prop) || this.domEl.getAttribute(prop)
    if (val) {
      return parseInt(val, 10)
    }
  }

  get fill() {
    return this.domEl.getAttribute('fill') || '#000'
  }

  get opacity() {
    const num = this.subject.get('opacity')
    return num ? parseFloat(num) : 1
  }

  isDefaultValue(key: string, value: any): boolean {
    switch (key) {
      case 'x':
        return value === Centroid[0]
      case 'y':
        return value === Centroid[1]
      case 'fill':
        return value === '#000000'
      case 'opacity':
        return value === 1
      default:
        return value === null
    }
  }

  omitNonDomProps(props: Record<string, string | number>) {
    const validProps = {} as Record<string, string | number>
    for (const key in props) {
      if (!nonDomProps.has(key)) {
        validProps[key] = props[key]
      }
    }
    return validProps
  }
}