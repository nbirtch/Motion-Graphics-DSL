import { physics } from 'popmotion'

import { DefaultAnimationParameters, Scaling } from '../ast-types'
import { Animation } from './types'
import { run } from './util'

function create(
  params: DefaultAnimationParameters & Scaling,
  identifier: string
): Animation {
  const { scaleFactor, duration } = params

  const normalizedVelocity = scaleFactor >= 1 ? scaleFactor : 1 / scaleFactor

  const animation = physics({
    from: 1,
    velocity: normalizedVelocity,
  }).while((v) => duration === undefined || v <= duration * normalizedVelocity)

  return {
    identifier,
    async start(element) {
      const [base, sub] = await run(
        element,
        animation,
        params,
        (scale: number) => {
          const trueScale = scaleFactor >= 1 ? scale : 1 / scale
          element.domEl.style.transform = `scale(${trueScale})`
          element.domEl.style.transformOrigin = `${element.get(
            'x'
          )}px ${element.get('y')}px`
        }
      )
      element.velocity = scaleFactor
      element.runner = {
        identifier,
        stop() {
          sub.stop()
          base.stop()
        },
        reset() {
          sub.stop()
          base.stop()
          element.subject.set('scale', 1)
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
