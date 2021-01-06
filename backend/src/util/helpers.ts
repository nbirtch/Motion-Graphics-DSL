// Converts all keys of the enum to lowercase, removing case sensitivity of program
export function allToLowerCase(enumType: Object): string[] {
  return Object.keys(enumType).map((key) => key.toLowerCase())
}
