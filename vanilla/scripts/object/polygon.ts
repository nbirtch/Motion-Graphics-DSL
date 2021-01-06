import Element, { DefaultAttrs } from './element'

type PolygonAttrs = DefaultAttrs & {
  shape: string
  points?: number[][]
  length?: number
}

type PolygonElAttrs = DefaultAttrs & {
  length: number
  points: string
}

export default class Polygon extends Element<PolygonElAttrs> {
  constructor(
    identifier: string,
    { x, y, length = 8, points, shape, ...params }: PolygonAttrs
  ) {
    super(identifier, Element.createSvgElement('polygon'), {
      points: (points || makePoints(x, y, shape, length) || [[x, y]])
        .map((point) => point.join(','))
        .join(' '),
      length,
      x,
      y,
      ...params,
    })

    if (!this.domEl.getAttribute('points')?.length) {
      this.hasShape = false
    }
  }

  get(prop: string) {
    if (prop === 'length') {
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

function makePoints(
  x: number,
  y: number,
  shape: string,
  length: number
): number[][] | null {
  const sides: Record<string, number> = {
    triangle: 3,
    pentagon: 5,
    hexagon: 6,
    octagon: 8,
  }
  if (shape in sides) {
    return makePolygon(x, y, sides[shape], length)
  }
  return null
}

function makePolygon(x: number, y: number, n: number, r: number) {
  const points = []

  // from https://stackoverflow.com/questions/3436453/calculate-coordinates-of-a-regular-polygons-vertices
  for (let i = 0; i < n; i++) {
    points.push([
      x + r * Math.cos((2 * Math.PI * i) / n),
      y + r * Math.sin((2 * Math.PI * i) / n),
    ])
  }
  return points
}
