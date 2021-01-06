import { physics } from 'popmotion'

import {
  Direction,
  DefaultAnimationParameters,
  Translation,
  Vector2D,
} from '../ast-types'
import { Animation } from './types'
import { run } from './util'

function create(
  params: DefaultAnimationParameters & Translation,
  identifier: string
): Animation {
  const { direction, velocity, duration, fill, opacity } = params
  const directionVector = getDirectionVector(direction)

  const animation = physics({
    velocity: directionVector,
  })
    .pipe((vector: number[]) => vector.map((v) => v * velocity))
    .while(([x, y]) => {
      if (duration === undefined) {
        return true
      }
      const [xMax, yMax] = getFinalPos(directionVector, velocity, duration)
      return Math.abs(x) <= Math.abs(xMax) && Math.abs(y) <= Math.abs(yMax)
    })

  return {
    identifier,
    async start(element) {
      const [base, sub] = await run(element, animation, params, ([x, y]) => {
        element.subject.set({ x, y })
      })

      element.velocity = 1
      element.runner = {
        identifier,
        stop() {
          base.stop()
          sub.stop()

          const { subject, lastState } = element
          const x = subject.get('x')
          const y = subject.get('y')
          subject.set('x', 0)
          subject.set('y', 0)

          const { x: startX = 0, y: startY = 0 } = lastState
          element.setAttributes({ x: startX + x, y: startY + y })
          element.lastState = { ...lastState, x: startX + x, y: startY + y }
        },
        reset() {
          base.stop()
          sub.stop()

          element.subject.set('x', 0)
          element.subject.set('y', 0)
          element.setAttributes(element.initial)
        },
        changeSpeed(factor) {
          if (sub.setVelocity) {
            const { velocity } = element
            sub.setVelocity(velocity * factor)
            element.velocity = factor
          } else {
            console.error(
              `Trying to change speed of a non-physics animation ${identifier} on entity ${element.identifier}`
            )
          }
        },
      }
    },
  }
}

export default {
  create,
}

const getDirectionVector = (direction: Direction | Vector2D): Vector2D => {
  switch (direction) {
    case Direction.Left:
      return [-1, 0]
    case Direction.Right:
      return [1, 0]
    case Direction.Up:
      return [0, -1]
    case Direction.Down:
      return [0, 1]
    default:
      return normalize(direction)
  }
}

const getFinalPos = (
  direction: Vector2D,
  velocity: number,
  duration: number
) => {
  return direction.map((coord) => coord * velocity * duration) as Vector2D
}

const normalize = (vector: Vector2D): Vector2D => {
  const [x, y] = vector
  const sum = Math.sqrt(x ** 2 + y ** 2)
  return [x / sum, y / sum]
}
