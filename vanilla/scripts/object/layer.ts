import Element, { DefaultAttrs } from './element'

export default class Layer extends Element {
  members: Set<Element>

  constructor(identifier: string, params: DefaultAttrs, members: Element[]) {
    super(identifier, Element.createSvgElement('g'), params)

    const objectProps = omitLayerSpecificProps(params)
    this.members = new Set(members)
    this.members.forEach((member) => {
      const newProps = member.setDefaultAttributes(objectProps)
      const shape = member.newShape(newProps)
      this.domEl.appendChild(shape.domEl)
    })
  }
}

const layerSpecificProps = new Set(['objects'])

function omitLayerSpecificProps(props: Record<string, string | number>) {
  const validProps = {} as Record<string, string | number>
  for (const key in props) {
    if (!layerSpecificProps.has(key)) {
      validProps[key] = props[key]
    }
  }
  return validProps
}
