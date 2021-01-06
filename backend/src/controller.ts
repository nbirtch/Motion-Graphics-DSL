import { Request, Response } from 'express'
import { Tokenizer } from './tokenizer'
import { Parser } from './parser/parser'
import * as AST from './types'

export class Controller {
  private input: string = ''

  public constructor(request: Request, response: Response) {
    this.input = request.body?.input

    try {
      const program: AST.Program = this.createProgram(this.input)
      response.status(201).send(program)
    } catch (error) {
      // Invalid parameter or token received
      console.error(error)
      response.status(422).send(error)
    }
  }

  public createProgram(input: string): AST.Program {
    const tokenizer: Tokenizer = new Tokenizer(input)
    tokenizer.tokenizeInput()

    const parser: Parser = new Parser(tokenizer)
    parser.parse()
    return parser.getProgram()
  }
}
