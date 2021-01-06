import { Parser } from './parser'
import { Persistence } from './Persistence'
import {
  Create as CreateType,
  EntityTypes,
  Identifier,
  Parameters,
} from '../types'
import InvalidToken from "../errors/InvalidToken";

export class Create extends Persistence {
  private entity: EntityTypes
  private identifier: Identifier
  private parameters: Parameters

  constructor(parser: Parser) {
    super(parser)
  }

  public parse(): CreateType {
    this.parser.parseToken('create')

    this.entity = this.parser.parseToken(
      '(object|layer|animation)'
    ) as EntityTypes

    this.identifier = this.parser.parseToken('[a-zA-Z0-9]+')

    // reserved entity type names so that they can't be used as identifiers, prevents issues w/ parsing
    if (this.identifier.toLowerCase() in EntityTypes) {
      throw new InvalidToken('object, animation and layer are reserved and cant be used as identifiers.')
    }

    try {
      const parameters = this.parseParameters(this.entity)
      // allowing no parameters, they can user layers to set default parameters
      if (parameters.length == 0) this.parameters = {}
      else parameters.forEach((param) => {
        this.parameters = {
          ...this.parameters,
          [param.getName()]: param.getValue(),
        }
      })
    } catch (error) {
      throw error
    }

    return {
      type: 'create',
      identifier: this.identifier,
      entity: this.entity,
      parameters: this.parameters,
    }
  }
}
