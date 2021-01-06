import { tween, Action, ColdSubscription } from 'popmotion'

import { DefaultAnimationParameters } from '../ast-types'
import { Element } from '../object'
import { getHex } from '../utils/color'

export function run(
  element: Element,
  animation: Action,
  params: DefaultAnimationParameters,
  onUpdate: (props: any) => void
): Promise<[ColdSubscription, ColdSubscription]> {
  const { fill, opacity, duration = 10, delay: delayDuration = 0 } = params
  const { fill: startFill, opacity: startOpacity } = element

  const hexFill = getHex(fill || startFill)
  const startHexFill = getHex(startFill)

  const base = tween({
    from: { fill: startHexFill, opacity: startOpacity },
    to: { fill: hexFill, opacity: opacity || startOpacity },
    duration: duration * 1000,
  })

  return new Promise((res) => {
    setTimeout(() => {
      const baseAnim = base.start((baseProps: any) => {
        element.subject.set({ ...baseProps })
      })
      const mainAnim = animation.start(onUpdate)
      res([baseAnim, mainAnim])
    }, delayDuration * 1000)
  })
}
