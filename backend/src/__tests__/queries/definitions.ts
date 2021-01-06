export const input = [
  `create animation moveright:
    velocity: +10.0
    direction: right
  
    duration: 20
  
  create animation rotate:
    angularVelocity: -20.0
  
    delay: 15
    duration: 15
      
  create animation scale:
    scaleFactor: 2
  
    fill: green
    opacity: 1.0
  
  
  create object mycircle:
    shape: circle
    radius: 3
  
    fill: blue
    x: 44
    y: 44
  
  create object myrectangle:
    shape: rectangle
    width: 6
    height: 4
  
    x: 22
    y: 23
  
  create object mypentagon:
    shape: pentagon
    length: 5
  
    fill: yellow
    x: 4
    y: 4
    opacity: 0.1
  
  create object mypolygon:
    shape: polygon
    points: [[0,0] [0,5] [5,5] [5,0]]
  
    fill: green
    opacity: 1.0
  
  create layer background:
    priority: 1
    objects: [mycircle myrectangle mypolygon]
  
    shape: rectangle
    width: 4
    height: 4
    radius: 4
    length: 4
    points: [[0,0] [0,4] [4,4] [4,0]]
  
    fill: purple
    x: 0
    y: 0
    opacity: 1.0`,
]

export const output = [
  {
    definitions: [],
    main: [
      {
        type: 'create',
        identifier: 'moveright',
        entity: 'animation',
        parameters: {
          velocity: 10.0,
          direction: 'right',
          duration: 20,
        },
      },
      {
        type: 'create',
        identifier: 'rotate',
        entity: 'animation',
        parameters: {
          angularVelocity: -20.0,
          delay: 15,
          duration: 15,
        },
      },
      {
        type: 'create',
        identifier: 'scale',
        entity: 'animation',
        parameters: {
          scaleFactor: 2,
          fill: 'green',
          opacity: 1.0,
        },
      },
      {
        type: 'create',
        identifier: 'mycircle',
        entity: 'object',
        parameters: {
          shape: 'circle',
          radius: 3,
          fill: 'blue',
          x: 44,
          y: 44,
        },
      },
      {
        type: 'create',
        identifier: 'myrectangle',
        entity: 'object',
        parameters: {
          shape: 'rectangle',
          width: 6,
          height: 4,
          x: 22,
          y: 23,
        },
      },
      {
        type: 'create',
        identifier: 'mypentagon',
        entity: 'object',
        parameters: {
          shape: 'pentagon',
          length: 5,
          fill: 'yellow',
          x: 4,
          y: 4,
          opacity: 0.1,
        },
      },
      {
        type: 'create',
        identifier: 'mypolygon',
        entity: 'object',
        parameters: {
          shape: 'polygon',
          points: [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0],
          ],
          fill: 'green',
          opacity: 1.0,
        },
      },
      {
        type: 'create',
        identifier: 'background',
        entity: 'layer',
        parameters: {
          priority: 1,
          objects: ['mycircle', 'myrectangle', 'mypolygon'],
          shape: 'rectangle',
          width: 4,
          height: 4,
          radius: 4,
          length: 4,
          points: [
            [0, 0],
            [0, 4],
            [4, 4],
            [4, 0],
          ],
          fill: 'purple',
          x: 0,
          y: 0,
          opacity: 1.0,
        },
      },
    ],
  },
]
