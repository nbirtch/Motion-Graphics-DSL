import { Parser } from '../parser/parser'
import { Tokenizer } from '../tokenizer'

describe('Parser', () => {
  it.each([
    ['all valid types of statements', 'valid.ts'],
    ['valid definitions of animations, objects, and layers', 'definitions.ts'],
    ['valid deletion of entities', 'delete.ts'],
    ['valid wait statements', 'wait.ts'],
    ['valid collision statements', 'collision.ts'],
    ['valid animate statements', 'animate.ts'],
    ['valid looping constructs', 'loop.ts'],
    ['valid conditional constructs', 'conditional.ts'],
  ])('%s', (testTitle: string, path: string) => {
    const {
      input,
      output,
    }: { input: string[]; output: object[] } = require(`./queries/${path}`)

    if (input.length !== output.length) {
      fail(
        'Test files have invalid structure: input and output arrays should be the same length!'
      )
    }

    for (let i = 0; i < input.length; i++) {
      const tokenizer = new Tokenizer(input[i])
      tokenizer.tokenizeInput()

      const parser = new Parser(tokenizer)
      parser.parse()

      expect(parser.getProgram()).toEqual(output[i])
    }
  })
})
