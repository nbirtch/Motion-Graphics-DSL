import { Program } from './ast-types'

const url = 'https://frozen-retreat-15361.herokuapp.com/parse'

export function getProgram(input: string): Promise<Program> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  }).then((res) => {
    if (res.status < 400) {
      return res.json()
    } else {
      return res.json().then(data => Promise.reject(data))
    }
  })
}
