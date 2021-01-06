import Element, { DefaultAttrs } from './element'

type SquareParams = DefaultAttrs & {
  x: number
  y: number
  width?: number
  height?: number
}

export default class Square extends Element<SquareParams> {
  constructor(
    identifier: string,
    { width = 40, height = 40, ...params }: SquareParams
  ) {
    super(identifier, Element.createSvgElement('rect'), {
      width,
      height,
      ...params,
    })
  }

  get(prop: string) {
    if (prop === 'width' || prop === 'height') {
      const scale = super.get('scale')
      const length = this.domEl.getAttribute(prop)
      if (length) {
        const lengthNum = parseInt(length, 10)
        if (scale) {
          return lengthNum * scale
        }
        return lengthNum
      }
    }
    return super.get(prop)
  }
}
