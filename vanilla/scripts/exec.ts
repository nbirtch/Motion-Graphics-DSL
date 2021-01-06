import {
  Program,
  EntityTypes,
  eObject,
  eAnimation,
  Step,
  LayerParameters,
} from './ast-types'
import Anim, { Animation } from './animation'
import Global from './global'
import Condition from './conditional'
import Obj, { Element } from './object'
import { Context } from './types'
import { log } from './utils/log'

export const objects: Map<string, Element> = new Map()
export const animations: Map<string, Animation> = new Map()

export function exec(program: Program, container: HTMLElement) {
  const { definitions, main } = program

  for (const step of definitions) {
    runStep(step, { objects, animations, container })
  }

  let queue = [...main]

  return {
    play: async () => {
      const context = { objects, animations, container }
      while (queue.length > 0) {
        const step = queue.shift()
        if (step) {
          await runStep(step, context)
        }
      }
    },
    stop: () => {
      objects.forEach((value) => {
        value.runner?.stop()
      })
    },
    reset: () => {
      queue = [...main]
      objects.forEach((value) => {
        value.runner?.reset()
      })
    },
  }
}

async function runStep(step: Step, context: Context) {
  switch (step.type) {
    case 'animate':
      await Anim.exec(step, context)
      break
    case 'wait':
    case 'collision':
      await Global.exec(step, context)
      break
    case 'if': {
      const pass = Condition.exec(step, context)
      log(
        `If: ${step.condition.lhs} ${step.condition.op} ${step.condition.rhs} -> ${pass}`
      )
      if (pass) {
        for (const subStep of step.body) {
          await runStep(subStep, context)
        }
      }
      break
    }
    case 'loop': {
      while (Condition.exec(step, context)) {
        for (const subStep of step.body) {
          await runStep(subStep, context)
        }
      }
      break
    }
    case 'create': {
      log(`Creating: ${step.identifier}`)
      log(step.parameters)
      if (step.entity === EntityTypes.animation) {
        Anim.create(
          step.parameters as eAnimation['parameters'],
          step.identifier,
          context
        )
      } else if (step.entity === EntityTypes.object) {
        Obj.create(
          step.parameters as eObject['parameters'],
          step.identifier,
          context
        )
      } else if (step.entity === EntityTypes.layer) {
        const parameters = step.parameters as LayerParameters
        const members = parameters.objects
          .map((id) => context.objects.get(id))
          .filter(Boolean) as Element[]
        Obj.layer(parameters, step.identifier, members, context)
      }
      break
    }
    case 'update': {
      log(`Updating: ${step.identifier}`)
      log(step.parameters)
      if (step.entity === EntityTypes.object) {
        Obj.update(
          step.parameters as eObject['parameters'],
          step.identifier,
          context
        )
      }
      break
    }
    case 'delete':
      log(`Delete: ${step.identifier}`)
      if (step.entity === EntityTypes.object) {
        Obj.remove(step.identifier, context)
      } else if (step.entity === EntityTypes.animation) {
        Anim.remove(step.identifier, context)
      }
      break
  }
}

export function clear(container: HTMLElement) {
  objects.forEach((value) => {
    value.runner?.stop()
  })

  objects.forEach((_, key) => {
    Obj.remove(key, { objects, animations, container })
  })

  objects.clear()
  animations.clear()
}
