import { Global } from '../ast-types'
import { Context } from '../types'
import { log } from '../utils/log'

function exec(step: Global, context: Context): Promise<void> {
  switch (step.type) {
    case 'wait':
      log(`Global: Waiting for ${step.duration} seconds`)
      return new Promise((res) => {
        setTimeout(() => {
          log('Global: Done waiting')
          res()
        }, step.duration * 1000)
      })
    case 'collision':
      console.error(`Collision isn't implemented. Skipping...`)
      return Promise.resolve()
  }
}

export default { exec }
