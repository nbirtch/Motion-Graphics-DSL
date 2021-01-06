import Color from 'color'

export function getHex(fill: string): string {
  if (/^[0-9A-Fa-f]{6}$/i.test(fill)) {
    return '#' + fill
  }
  return Color(fill).hex()
}
