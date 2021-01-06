import { Parser } from './parser'
import { Persistence } from './Persistence'
import {
  EntityTypes,
  Identifier,
  Parameters,
  Update as UpdateType,
} from '../types'
import InvalidParameter from "../errors/InvalidParameter";

export class Update extends Persistence {
  private entity: EntityTypes
  private identifier: Identifier
  private parameters: Parameters

  constructor(parser: Parser) {
    super(parser)
  }

  public parse(): UpdateType {
    this.parser.parseToken('update')

    this.entity = this.parser.parseToken(
      'object|layer|animation'
    ) as EntityTypes
    this.identifier = this.parser.parseToken('[a-zA-Z0-9]+')

    try {
      const parameters = this.parseParameters(this.entity)
      // not allowing no parameters
      if (parameters.length == 0) throw new InvalidParameter(this.identifier + ' - update requires parameters')
      parameters.forEach((param) => {
        this.parameters = {
          ...this.parameters,
          [param.getName()]: param.getValue(),
        }
      })
    } catch (error) {
      throw error
    }

    return {
      type: 'update',
      identifier: this.identifier,
      entity: this.entity,
      parameters: this.parameters,
    }
  }
}
