import { Parsable } from './IParsable'
import { Parser } from './parser'
import InvalidParameterError from '../errors/InvalidParameter'
import { Tokenizer } from '../tokenizer'
import {
  AnimationParametersEnum,
  LayerParametersEnum,
  ObjectParametersEnum,
  Parameter as ParameterType,
} from '../types'
import {
  FLOATING_POINT_REGEX,
  NUMBER_REGEX,
  OBJECTS_REGEX,
  OPACITY_REGEX,
  SCALE_REGEX,
  COORDINATE_REGEX,
  IDENTIFIER_REGEX,
  DIRECTION_REGEX,
  POINTS_REGEX,
  FILL_REGEX,
  SHAPE_REGEX,
} from '../util/regex'

export class Parameter implements Parsable<ParameterType> {
  private parser: Parser
  private tokenizer: Tokenizer

  private name: string
  private value: any

  public constructor(parser: Parser, name: string) {
    this.parser = parser
    this.name = name
    this.tokenizer = parser.getTokenizer()
  }

  public getName(): string {
    return this.name
  }

  public getValue(): any {
    return this.value
  }

  public parse(): ParameterType {
    this.parser.parseToken(this.name)
    this.parser.parseToken(':')

    let param: string
    switch (this.name.toLowerCase()) {
      case AnimationParametersEnum.duration:
      case AnimationParametersEnum.delay:
      case ObjectParametersEnum.x:
      case ObjectParametersEnum.y:
      case ObjectParametersEnum.radius:
      case ObjectParametersEnum.width:
      case ObjectParametersEnum.height:
      case ObjectParametersEnum.length:
      case ObjectParametersEnum.priority:
        param = this.parser.parseToken(NUMBER_REGEX)
        this.value = Number(param)
        break

      case ObjectParametersEnum.fill:
        this.value = this.parser.parseToken(FILL_REGEX)
        break

      case ObjectParametersEnum.opacity:
        param = this.parser.parseToken(OPACITY_REGEX)
        this.value = Number(param)
        break

      case AnimationParametersEnum.velocity:
      case AnimationParametersEnum.angularVelocity.toLowerCase():
        param = this.parser.parseToken(FLOATING_POINT_REGEX)
        this.value = Number(param)
        break

      case ObjectParametersEnum.shape:
        this.value = this.parser.parseToken(SHAPE_REGEX)
        break

      case AnimationParametersEnum.scaleFactor.toLowerCase():
        param = this.parser.parseToken(SCALE_REGEX)
        this.value = Number(param)
        break

      case AnimationParametersEnum.direction:
        if (this.tokenizer.checkToken('\\[')) {
          param = this.parseCoordinate()
          let coord: number[] = param
            .substring(1, param.length - 1)
            .split(',')
            .map((number) => Number(number))
          this.value = [coord[0], coord[1]]
        } else {
          this.value = this.parser.parseToken(DIRECTION_REGEX)
        }
        break

      case LayerParametersEnum.objects:
        param = this.parseObjects()
        if (param.length == 2) this.value = []
        // empty list input case
        else this.value = param.substring(1, param.length - 1).split(' ')
        break

      case ObjectParametersEnum.points:
        param = this.parsePoints()
        let points: Array<[number, number]> = []
        param
          .substring(1, param.length - 1)
          .split(' ')
          .forEach((coordinate) => {
            let coord: number[] = coordinate
              .substring(1, coordinate.length - 1)
              .split(',')
              .map((number) => Number(number))
            points.push([coord[0], coord[1]])
          })
        this.value = points
        break

      default:
        throw new InvalidParameterError(this.name)
    }
    return {
      parameter: this.name,
      value: this.value,
    }
  }

  private parseCoordinate(): string {
    let coordinate: string = this.parser.parseToken('\\[')
    coordinate += this.parser.parseToken(NUMBER_REGEX)
    coordinate += this.parser.parseToken(',')
    coordinate += this.parser.parseToken(NUMBER_REGEX)
    coordinate += this.parser.parseToken('\]')
    if (!new RegExp('^' + COORDINATE_REGEX + '$').test(coordinate)) {
      throw new InvalidParameterError(this.name + ' - ' + coordinate)
    }
    return coordinate
  }

  private parsePoints(): string {
    let points: string = this.parser.parseToken('\\[')
    // polygon requires at least 3 points
    for (let i = 0; i < 3; i++) {
      points += this.parseCoordinate() + ' '
    }
    // parse remaining points
    while (!this.tokenizer.checkToken('\]')) {
      points += this.parseCoordinate() + ' '
    }
    // remove extra whitespace at end
    points = points.trim() + this.parser.parseToken('\]')
    if (!new RegExp('^' + POINTS_REGEX + '$').test(points)) {
      throw new InvalidParameterError(this.name + ' - ' + points)
    }
    return points
  }

  private parseObjects(): string {
    let objects: string = this.parser.parseToken('\\[')
    // parse any identifiers
    while (!this.tokenizer.checkToken('\]')) {
      objects += this.parser.parseToken(IDENTIFIER_REGEX) + ' '
    }
    // remove extra whitespace at end
    objects = objects.trim() + this.parser.parseToken('\]')
    if (!new RegExp('^' + OBJECTS_REGEX + '$').test(objects)) {
      throw new InvalidParameterError(this.name + ' - ' + objects)
    }
    return objects
  }
}
