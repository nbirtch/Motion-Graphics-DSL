import { AST } from './AST'
import { Animate } from './Animate'
import { Collision } from './Collision'
import { Create } from './Create'
import { Delete } from './Delete'
import { Parsable } from './IParsable'
import { Parser } from './parser'
import { Tokenizer } from '../tokenizer'
import { Update } from './Update'
import { Wait } from './Wait'
import {
  AnimationParametersEnum,
  EntityTypes,
  Execution as ExecutionType,
  LayerParametersEnum,
  ObjectParametersEnum,
  OP as OPType,
} from '../types'
import InvalidParameter from '../errors/InvalidParameter'
import InvalidTokenError from '../errors/InvalidToken'
import {
  FLOATING_POINT_REGEX,
  NUMBER_REGEX,
  OPACITY_REGEX,
} from '../util/regex'
import * as utils from '../util/helpers'

export class Execution implements Parsable<ExecutionType> {
  private parser: Parser
  private tokenizer: Tokenizer
  private AST: AST

  private VALID_COND_REGEX =
    '(' +
    NUMBER_REGEX +
    '|' +
    OPACITY_REGEX +
    '|' +
    FLOATING_POINT_REGEX +
    ')'

  public constructor(parser: Parser) {
    this.parser = parser

    this.tokenizer = parser.getTokenizer()
    this.AST = parser.getAST()
  }

  public parse(): ExecutionType {
    if (this.tokenizer.checkToken('main')) {
      this.parser.parseToken('main')
      this.parser.parseToken(':')
    }

    while (1) {
      // continue to iterate through main statements until END_TOKEN or invalid state reached.
      if (this.parseStatement()) {
        continue
      }
      // if token == END_TOKEN" -> finish parsing
      if (this.tokenizer.checkToken('END_TOKEN')) {
        break
      }
      throw new InvalidTokenError(this.tokenizer.checkNext())
    }
    return this.AST.getMain()
  }

  // Statement ::= Persistence | Deletion | AnimationOrchestration | Wait | Collisions | Condition | Looping
  public parseStatement(): boolean {
    return (
      this.parsePersistence() ||
      this.parseDeletion() ||
      this.parseAnimationOrchestration() ||
      this.parseWait() ||
      this.parseCollisions() ||
      this.parseCondition() ||
      this.parseLoop()
    )
  }

  public parsePersistence(): boolean {
    return this.parseCreation() || this.parseUpdate()
  }

  public parseCreation(): boolean {
    if (this.tokenizer.checkToken('create')) {
      const create: Create = new Create(this.parser)
      return this.AST.addDefinition(create, 'main')
    }
    return false
  }

  public parseUpdate(): boolean {
    if (this.tokenizer.checkToken('update')) {
      const update: Update = new Update(this.parser)
      return this.AST.updateDefinition(update, 'main')
    }
    return false
  }

  // Deletion ::= "delete" Entity Identifier
  public parseDeletion(): boolean {
    if (this.tokenizer.checkToken('delete')) {
      const del: Delete = new Delete(this.parser)
      return this.AST.deleteDefinition(del)
    }
    return false
  }

  /*
      AnimationOrchestration ::= AnimationAction PerformAnimation
      AnimationAction ::= "start" | "stop" | "speedUp" | "slowDown" | "reset"
      PerformAnimation ::= AnimationIdentifier Entity (ObjectIdentifier | LayerIdentifier)? <- can get rid of Entity if Identifiers are unique across entity types
    */
  public parseAnimationOrchestration(): boolean {
    if (this.tokenizer.checkToken('start|stop|speedup|slowdown|reset')) {
      const animate: Animate = new Animate(this.parser)
      return this.AST.addAnimation(animate)
    }
    return false
  }

  // Wait ::= "wait" Time
  public parseWait(): boolean {
    if (this.tokenizer.checkToken('wait')) {
      const wait: Wait = new Wait(this.parser)
      return this.AST.addWait(wait)
    }
    return false
  }

  // Collisions ::= "collisions" ("on" | "off")
  public parseCollisions(): boolean {
    if (this.tokenizer.checkToken('collisions')) {
      const collision: Collision = new Collision(this.parser)
      return this.AST.addCollision(collision)
    }
    return false
  }

  /*
         Condition ::= "if" X OP Y "(" Statement+ ")"
         OP::= "<" | ">" | "<=" | ">=" | "==" | "!="
         X/Y ::= Entity Identifier "." Parameter | String | Number
      */
  public parseCondition(): boolean {
    if (this.tokenizer.checkToken('if')) {
      return this.parseConditional('if')
    }
    return false
  }

  /*
        Looping::= "loop" LoopingParameters "(" Statement+ ")"
        LoopingParameters::= "count" Integer | "if" X OP Y
    */
  public parseLoop(): boolean {
    if (this.tokenizer.checkToken('loop')) {
      this.parser.parseToken('loop')

      let count: number = -1
      let X: string = ''
      let OP: OPType = '' as OPType
      let Y: string = ''

      if (this.tokenizer.checkToken('count')) {
        this.parser.parseToken('count')
        const value = this.parser.parseToken('[0-9]+')
        count = parseInt(value)

        // parse Statements
        this.parser.parseToken('\\(')
        this.AST.startLoop()

        while (1) {
          // continue to iterate through main statements until ")" or invalid state reached.
          if (this.parseStatement()) {
            continue
          }
          // if token == ")" -> finish parsing conditional block
          if (this.tokenizer.checkToken('\\)')) {
            this.parser.parseToken('\\)')
            break
          }
          throw new InvalidTokenError(this.tokenizer.checkNext())
        }

        // Set AST: Conditional w/ type, count, X, OP, Y, Statements
        return this.AST.endLoop(count, X, OP, Y)
      } else if (this.tokenizer.checkToken('if')) {
        return this.parseConditional('loop')
      }
    }
    return false
  }

  public parseConditional(type: string): boolean {
    let flag: boolean = type == 'if'

    this.parser.parseToken('if')

    let X: string = ''
    let OP: OPType = '' as OPType
    let Y: string = ''

    // if X is an Entity Identifier.Parameter statement
    if (this.tokenizer.checkToken('(object|layer|animation)')) {
      X = this.parseOperand()
    } else {
      // X is a numeric
      X = this.parser.parseToken(this.VALID_COND_REGEX)
    }

    OP = this.parser.parseToken('(<|>|<=|>=|==|!=)') as OPType

    // if Y is an Entity Identifier.Parameter statement
    if (this.tokenizer.checkToken('(object|layer|animation)')) {
      Y = this.parseOperand()
    } else {
      // Y is a numeric parameter
      Y = this.parser.parseToken(this.VALID_COND_REGEX)
    }

    // parse Statements
    this.parser.parseToken('\\(')
    if (flag) {
      this.AST.startIf()
    } else {
      this.AST.startLoop()
    }

    while (1) {
      // continue to iterate through main statements until ")" or invalid state reached.
      if (this.parseStatement()) {
        continue
      }
      // if token == ")" -> finish parsing conditional block
      if (this.tokenizer.checkToken('\\)')) {
        this.parser.parseToken('\\)')
        break
      }
      throw new InvalidTokenError(this.tokenizer.checkNext())
    }

    // Set AST: Conditional w/ type, X, OP, Y, Statements
    if (flag) {
      return this.AST.endIf(X, OP, Y)
    } else {
      return this.AST.endLoop(-1, X, OP, Y)
    }
  }

  public parseOperand(): string {
    const entity: string = this.parser.parseToken(
      '(object|layer|animation)'
    ) as EntityTypes

    const IDParam: string = this.parser.parseToken('[a-zA-Z0-9]+\\.[a-zA-Z]+')

    let [ID, param]: string[] = IDParam.split('.')
    let paramValue = param.toLowerCase()

    // validate entity parameter, not supporting Lists or Coordinate parameters
    switch (entity) {
      case EntityTypes.object:
        if (
          !utils.allToLowerCase(ObjectParametersEnum).includes(paramValue) ||
          paramValue === ObjectParametersEnum.points
        ) {
          throw new InvalidParameter(paramValue + ' is not an object property')
        }
        break
      case EntityTypes.animation:
        if (
          !utils.allToLowerCase(AnimationParametersEnum).includes(paramValue)
        ) {
          throw new InvalidParameter(paramValue + ' is not an animation property')
        }
        break
      case EntityTypes.layer:
        if (
          !utils.allToLowerCase(LayerParametersEnum).includes(paramValue) ||
          paramValue === LayerParametersEnum.objects
        ) {
          throw new InvalidParameter(paramValue + ' is not a layer property')
        }
        break
    }

    return entity + ' ' + ID + ' ' + param
  }
}
