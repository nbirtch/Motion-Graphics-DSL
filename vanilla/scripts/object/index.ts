import { Centroid } from '../config'
import { eLayer, eObject } from '../ast-types'
import { Context } from '../types'

import Element from './element'
import Circle from './circle'
import Square from './square'
import Polygon from './polygon'
import Layer from './layer'

export { Element }

function create(
  parameters: eObject['parameters'],
  identifier: string,
  { container, objects }: Context
) {
  const {
    x = Centroid[0],
    y = Centroid[1],
    fill = 'currentColor',
    opacity = 1,
  } = parameters.style || {}

  const defaultAttributes = { x, y, fill, opacity }

  const objs = new Map([
    ['circle', Circle],
    ['rectangle', Square],
  ])

  const Component = objs.get(parameters.shape) || Polygon
  const obj = new Component(identifier, {
    ...defaultAttributes,
    ...parameters,
  })

  container.appendChild(obj.domEl)
  objects.set(identifier, obj)
  return obj
}

function layer(
  parameters: eLayer['parameters'],
  identifier: string,
  members: Element[],
  { container, objects }: Context
) {
  const {
    x = Centroid[0],
    y = Centroid[1],
    fill = 'currentColor',
    opacity = 1,
  } = parameters

  const defaultAttributes = { x, y, fill, opacity }
  const obj = new Layer(
    identifier,
    {
      ...defaultAttributes,
      ...parameters,
    },
    members
  )

  container.appendChild(obj.domEl)
  objects.set(identifier, obj)
}

function update(
  parameters: eObject['parameters'],
  identifier: string,
  { objects }: Context
) {
  const element = objects.get(identifier)
  if (element) {
    element.setAttributes(parameters as any)
  }
}

function remove(identifier: string, context: Context) {
  const element = context.objects.get(identifier)
  if (element) {
    context.container.removeChild(element.domEl)
    context.objects.delete(identifier)
  }
}

export default {
  create,
  layer,
  update,
  remove,
}
