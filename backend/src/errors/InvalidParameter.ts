export default class InvalidParameter extends Error {
  constructor(parameterName: string) {
    super()
    this.name = 'InvalidParameterError'
    this.message = 'Invalid Parameter - ' + parameterName

    // Allows for usage of `err instanceof InvalidParameterError`
    Object.setPrototypeOf(this, InvalidParameter.prototype)
  }
}
