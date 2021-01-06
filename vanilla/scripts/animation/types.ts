import { Element } from '../object'

export interface Animation {
  identifier: string
  start(entity: Element): void
}

export interface Runner {
  identifier: string
  stop(): void
  reset(): void
  changeSpeed(factor: number): void
}
