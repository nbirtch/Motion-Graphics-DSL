import '../styles/main.out.css'
import '../styles/app.css'

import { Program } from './ast-types'
import { Bounds } from './config'
import { exec, clear } from './exec'
import { getProgram } from './fetch'

const defaultValue = `define:
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
  )
`

const message = document.getElementById('empty-message') as HTMLElement
const execButton = document.getElementById('exec-button') as HTMLButtonElement
const playButton = document.getElementById('play-button') as HTMLButtonElement
const resetButton = document.getElementById('reset-button') as HTMLButtonElement

class State {
  state: ReturnType<typeof exec> | null
  program: Program | null
  container: HTMLElement

  constructor(container: HTMLElement) {
    this.state = null
    this.program = null
    this.container = container
  }

  fetch() {
    this.clear()
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement
    return getProgram(textarea.value).then((program) => this.init(program))
  }

  clear() {
    clear(this.container)
    if (this.state) {
      this.state = null
    }
  }

  init(program: Program) {
    this.program = program
    // copy the program because the runner mutates it
    this.state = exec(JSON.parse(JSON.stringify(program)), this.container)
  }

  run() {
    if (this.state) {
      this.state.play()
    }
  }

  reset() {
    this.clear()
    if (this.program) {
      this.init(this.program)
    }
  }
}

export const container = document.querySelector('#output > svg') as HTMLElement

if (container) {
  container.setAttribute('viewBox', `0 0 ${Bounds[0]} ${Bounds[1]}`)

  const textarea = document.getElementById('textarea') as HTMLTextAreaElement
  textarea.value = defaultValue

  const state = new State(container)

  execButton.addEventListener('click', () => {
    message.style.opacity = '1'
    message.innerText = 'Loading...'

    resetButton.disabled = true
    playButton.disabled = true

    state
      .fetch()
      .then(() => {
        resetButton.disabled = false
        playButton.disabled = false
        message.style.opacity = '0'
      })
      .catch((err) => {
        message.innerText = err.message
      })
  })

  playButton.addEventListener('click', () => state.run())

  resetButton.addEventListener('click', () => state.reset())
} else {
  console.error(`Cannot find container with id app`)
}
