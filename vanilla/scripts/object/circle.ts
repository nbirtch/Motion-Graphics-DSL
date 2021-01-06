import Element, { DefaultAttrs } from './element'

type CircleParams = DefaultAttrs & {
  radius?: number
}

export default class Circle extends Element<CircleParams> {
  constructor(identifier: string, { radius = 20, ...params }: CircleParams) {
    super(identifier, Element.createSvgElement('circle'), { radius, ...params })
  }

  setDomElAttribute(key: string, val: string) {
    switch(key) {
      case 'x':
      case 'y':
        if (this.isDefaultValue(key, this.get(key)) && !this.isDefaultValue(key, val)) {
          this.domEl.setAttribute('c' + key, val)
        }
        break
      default:
        super.setDomElAttribute(key, val)
    }
  }

  setAttributes({
    x: cx,
    y: cy,
    radius: r,
    ...rest
  }: Record<string, string | number>) {
    super.setAttributes({ cx, cy, r, ...rest })
  }

  get(prop: string) {
    if (prop === 'radius') {
      const scale = super.get('scale')
      const r = this.domEl.getAttribute('r')
      if (r) {
        const radius = parseInt(r, 10)
        if (scale) {
          return radius * scale
        }
        return radius
      }
    }

    if (prop === 'x' || prop === 'y') {
      const val = super.get(prop) || this.domEl.getAttribute('c' + prop)
      if (val) {
        if (typeof val === 'string') {
          return parseFloat(val)
        }
        return val
      }
    }

    return super.get(prop)
  }
}
