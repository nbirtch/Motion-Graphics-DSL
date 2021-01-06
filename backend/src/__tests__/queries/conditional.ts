export const input = [
  `if object mycircle.x <= 100 ( 
		start moveright object mycircle
		wait 10
  )`,
  `if animation scale.scaleFactor != 4 (
		update animation scale:
		  scaleFactor: 4
  )`,
  `if object mypolygon.fill == red ( collisions on )`,
]

export const output = [
  {
    definitions: [],
    main: [
      {
        type: 'if',
        condition: {
          op: '<=',
          lhs: 'object mycircle x',
          rhs: '100',
        },
        body: [
          {
            type: 'animate',
            action: 'start',
            animationIdentifier: 'moveright',
            entity: 'object',
            entityIdentifier: 'mycircle',
          },
          {
            type: 'wait',
            duration: 10,
          },
        ],
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'if',
        condition: {
          op: '!=',
          lhs: 'animation scale scaleFactor',
          rhs: '4',
        },
        body: [
          {
            type: 'update',
            identifier: 'scale',
            entity: 'animation',
            parameters: {
              scaleFactor: 4,
            },
          },
        ],
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'if',
        condition: {
          op: '==',
          lhs: 'object mypolygon fill',
          rhs: 'red',
        },
        body: [
          {
            type: 'collision',
            value: true,
          },
        ],
      },
    ],
  },
]
