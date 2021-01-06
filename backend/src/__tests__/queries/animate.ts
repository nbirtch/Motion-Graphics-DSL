export const input = [
  `start rotate layer background`,
  `stop rotate object mypolygon`,
  `speedUp rotate object myrectangle`,
  `slowDown rotate object mycircle`,
  `reset rotate object myrectangle`,
]

export const output = [
  {
    definitions: [],
    main: [
      {
        type: 'animate',
        action: 'start',
        animationIdentifier: 'rotate',
        entity: 'layer',
        entityIdentifier: 'background',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'animate',
        action: 'stop',
        animationIdentifier: 'rotate',
        entity: 'object',
        entityIdentifier: 'mypolygon',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'animate',
        action: 'speedUp',
        animationIdentifier: 'rotate',
        entity: 'object',
        entityIdentifier: 'myrectangle',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'animate',
        action: 'slowDown',
        animationIdentifier: 'rotate',
        entity: 'object',
        entityIdentifier: 'mycircle',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'animate',
        action: 'reset',
        animationIdentifier: 'rotate',
        entity: 'object',
        entityIdentifier: 'myrectangle',
      },
    ],
  },
]
