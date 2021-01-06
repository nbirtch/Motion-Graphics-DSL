import { physics } from 'popmotion'

import { Rotation, DefaultAnimationParameters } from '../ast-types'
import { Animation } from './types'
import { run } from './util'

function create(
  params: DefaultAnimationParameters & Rotation,
  identifier: string
): Animation {
  const { angularVelocity, duration } = params

  const animation = physics({
    velocity: angularVelocity,
  }).while((v) => duration === undefined || v <= duration * angularVelocity)

  return {
    identifier,
    async start(element) {
      const [base, sub] = await run(
        element,
        animation,
        params,
        (angle: number) => {
          element.domEl.style.transform = `rotate(${angle}deg)`
          element.domEl.style.transformOrigin = `${element.get(
            'x'
          )}px ${element.get('y')}px`
        }
      )
      element.velocity = angularVelocity
      element.runner = {
        identifier,
        stop() {
          base.stop()
          sub.stop()
        },
        reset() {
          base.stop()
          sub.stop()
          element.subject.set('rotate', 0)
        },
        changeSpeed(factor) {
          if (sub.setVelocity) {
            const { velocity } = element
            sub.setVelocity(velocity * factor)
            element.velocity = velocity * factor
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
