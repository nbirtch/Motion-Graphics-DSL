export const input = [
  `delete animation scale`,
  `delete object mycircle`,
  `delete layer background`,
]

export const output = [
  {
    definitions: [],
    main: [
      {
        type: 'delete',
        identifier: 'scale',
        entity: 'animation',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'delete',
        identifier: 'mycircle',
        entity: 'object',
      },
    ],
  },
  {
    definitions: [],
    main: [
      {
        type: 'delete',
        identifier: 'background',
        entity: 'layer',
      },
    ],
  },
]
