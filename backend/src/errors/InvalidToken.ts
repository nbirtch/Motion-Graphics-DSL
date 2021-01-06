export default class InvalidToken extends Error {
  constructor(token: string) {
    super()
    this.name = 'InvalidTokenError'
    this.message = 'Invalid Input - ' + token

    // Allows for usage of `err instanceof InvalidTokenError`
    Object.setPrototypeOf(this, InvalidToken.prototype)
  }
}
