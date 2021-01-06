export const input = [
  `loop if object myrectangle.x <= object mycircle.x (
    start moveright object myrectangle
    stop moveright object mycircle
    wait 10
    stop moveright object myrectangle
    start moveright object mycircle
  )`,
  `loop count 5 (
    collisions on
    wait 5
    collisions off
    wait 5
  )`,
]

export const output = [
  {
    definitions: [],
    main: [
      {
        type: 'loop',
        count: -1,
        condition: {
          op: '<=',
          lhs: 'object myrectangle x',
          rhs: 'object mycircle x',
        },
        body: [
          {
            type: 'animate',
            action: 'start',
            animationIdentifier: 'moveright',
            entity: 'object',
            entityIdentifier: 'myrectangle',
          },
          {
            type: 'animate',
            action: 'stop',
            animationIdentifier: 'moveright',
            entity: 'object',
            entityIdentifier: 'mycircle',
          },
          {
            type: 'wait',
            duration: 10,
          },
          {
            type: 'animate',
            action: 'stop',
            animationIdentifier: 'moveright',
            entity: 'object',
            entityIdentifier: 'myrectangle',
          },
          {
            type: 'animate',
            action: 'start',
            animationIdentifier: 'moveright',
            entity: 'object',
            entityIdentifier: 'mycircle',
          },
        ],
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'loop',
        count: 5,
        condition: {
          op: '',
          lhs: '',
          rhs: '',
        },
        body: [
          {
            type: 'collision',
            value: true,
          },
          {
            type: 'wait',
            duration: 5,
          },
          {
            type: 'collision',
            value: false,
          },
          {
            type: 'wait',
            duration: 5,
          },
        ],
      },
    ],
  },
]
