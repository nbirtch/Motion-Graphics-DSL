export const input = [
  `define:
    create object test1:
      shape: circle
      radius: 5

      x: 64
      y: 64

    create object test2: 
      shape: rectangle
      width: 3
      height: 4

      fill: red

    update object test1:
      fill: blue

  main:
    delete object test2
    collisions off

    create animation expand: 
      scaleFactor: 3
      duration: 30

    loop count 5 (
      start expand object test1
      wait 1
      if object test1.radius <= 10 ( wait 2 )
      stop expand object test1
    )`,
]

export const output = [
  {
    definitions: [
      {
        type: 'create',
        identifier: 'test1',
        entity: 'object',
        parameters: {
          shape: 'circle',
          radius: 5,
          y: 64,
          x: 64,
        },
      },
      {
        type: 'create',
        identifier: 'test2',
        entity: 'object',
        parameters: {
          shape: 'rectangle',
          width: 3,
          height: 4,
          fill: 'red',
        },
      },
      {
        type: 'update',
        identifier: 'test1',
        entity: 'object',
        parameters: {
          fill: 'blue',
        },
      },
    ],
    main: [
      {
        type: 'delete',
        identifier: 'test2',
        entity: 'object',
      },
      {
        type: 'collision',
        value: false,
      },
      {
        type: 'create',
        identifier: 'expand',
        entity: 'animation',
        parameters: {
          scaleFactor: 3,
          duration: 30,
        },
      },
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
            type: 'animate',
            action: 'start',
            animationIdentifier: 'expand',
            entity: 'object',
            entityIdentifier: 'test1',
          },
          {
            type: 'wait',
            duration: 1,
          },
          {
            type: 'if',
            condition: {
              op: '<=',
              lhs: 'object test1 radius',
              rhs: '10',
            },
            body: [
              {
                type: 'wait',
                duration: 2,
              },
            ],
          },
          {
            type: 'animate',
            action: 'stop',
            animationIdentifier: 'expand',
            entity: 'object',
            entityIdentifier: 'test1',
          },
        ],
      },
    ],
  },
]
