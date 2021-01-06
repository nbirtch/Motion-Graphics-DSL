import { Conditional } from '../ast-types'
import { Context } from '../types'

function exec(step: Conditional, context: Context) {
  if (step.type === 'loop' && typeof step.count === 'number') {
    if (step.count > 0) {
      step.count--
      return true
    }
    return false
  }

  const { op, lhs, rhs } = step.condition
  const evaluator = operators[op]

  const lhsResult = evaluate(lhs, context)
  const rhsResult = evaluate(rhs, context)
  return evaluator(lhsResult, rhsResult)
}

function evaluate(expr: string | number, context: Context): string | number {
  if (typeof expr === 'number') {
    return expr
  }

  if (!expr.includes(' ')) {
    return parseFloat(expr)
  }

  // only support accessing object parameters for now
  const [, id, prop] = expr.split(' ')
  const element = context.objects.get(id)

  if (!element) {
    throw new Error(
      `Trying to access property ${prop} of a non-existing element ${id}`
    )
  }

  const val = element.get(prop)
  if (typeof val !== 'number') {
    throw new Error(
      `Trying to access non-existent property ${prop} from element ${id}`
    )
  }

  return val
}

export default { exec }

type OperationEvaluator = (
  left: string | number,
  right: string | number
) => boolean

const lessThan: OperationEvaluator = (left, right) => left < right

const greaterThan: OperationEvaluator = (left, right) => left > right

const greaterThanOrEqual: OperationEvaluator = (left, right) => left >= right

const lessThanOrEqual: OperationEvaluator = (left, right) => left <= right

const equalTo: OperationEvaluator = (left, right) => left === right

const notEqualTo: OperationEvaluator = (left, right) => left !== right

const operators = {
  '<': lessThan,
  '>': greaterThan,
  '<=': lessThanOrEqual,
  '>=': greaterThanOrEqual,
  '==': equalTo,
  '!=': notEqualTo,
}
