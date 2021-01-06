export default class EndToken extends Error {
  constructor() {
    super()
    this.name = 'EndTokenError'
    this.message = "Encountered 'END' token!"

    // Allows for usage of `err instanceof EndTokenError`
    Object.setPrototypeOf(this, EndToken.prototype)
  }
}
