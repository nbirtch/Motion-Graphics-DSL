import { eAnimation, Animate, Action } from '../ast-types'
import { Context } from '../types'

import Translation from './translation'
import Rotation from './rotation'
import Scaling from './scaling'
import { Animation } from './types'
import { log } from '../utils/log'
import { Element } from '../object'

export * from './types'

type Builder = {
  create(animation: eAnimation['parameters'], identifier: string): Animation
}

const builders: Record<string, Builder> = {
  translation: Translation,
  rotation: Rotation,
  scale: Scaling,
}

function create(
  animation: eAnimation['parameters'],
  identifier: string,
  { animations }: Context
) {
  const anim = builders[getType(animation)].create(animation, identifier)
  animations.set(identifier, anim)
}

function getType(animation: eAnimation['parameters']) {
  if ('velocity' in animation) {
    return 'translation'
  } else if ('angularVelocity' in animation) {
    return 'rotation'
  } else if ('scaleFactor' in animation) {
    return 'scale'
  }
  throw new Error(`Unrecognized animation type. Received: ${animation}`)
}

const speedFactor = {
  [Action.speedUp]: 2,
  [Action.slowDown]: 0.5,
}

async function exec(step: Animate, context: Context) {
  const { animationIdentifier, entityIdentifier } = step
  const [element, animation] = getEntityAndAnimation(
    context,
    animationIdentifier,
    entityIdentifier
  )
  switch (step.action) {
    case Action.start: {
      if (element.runner) {
        log(
          `Anim: Entity ${entityIdentifier} is already animating. Stopping...`
        )
        element.runner.stop()
      }

      log(
        `Anim: Starting animation ${animationIdentifier} on entity ${entityIdentifier}`
      )
      await animation.start(element)
      break
    }
    case Action.stop: {
      log(
        `Anim: Stopping animation ${animationIdentifier} on entity ${entityIdentifier}`
      )
      getRunner(element)?.stop()
      break
    }
    case Action.reset: {
      log(`Anim: Resetting ${entityIdentifier}`)
      getRunner(element)?.reset()
      break
    }
    case Action.speedUp:
    case Action.slowDown: {
      log(
        `Anim: Changing velocity on entity ${entityIdentifier} by ${
          speedFactor[step.action]
        }`
      )
      getRunner(element)?.changeSpeed(speedFactor[step.action])
      break
    }
    default:
      throw new Error(`Not implemented: ${step.action}`)
  }
}

export function remove(identifier: string, context: Context) {
  context.objects.forEach((obj) => {
    if (obj.runner && obj.runner.identifier === identifier) {
      obj.runner.stop()
      obj.runner = null
    }
  })
  context.animations.delete(identifier)
}

export default {
  create,
  exec,
  remove,
}

function getEntityAndAnimation(
  { objects, animations }: Context,
  animationId: string,
  entityId: string
) {
  const mountedEntity = objects.get(entityId)
  const mountedAnimation = animations.get(animationId)

  if (!mountedEntity) {
    throw new Error(`Entity ${entityId} doesn't exist.`)
  }

  if (!mountedAnimation) {
    throw new Error(`Animation ${animationId} doesn't exist.`)
  }

  return [mountedEntity, mountedAnimation] as const
}

function getRunner(entity: Element) {
  const runner = entity.runner
  if (!runner) {
    console.error(`Entity ${entity.identifier} is not animating.`)
    return null
  }
  return runner
}
