export enum Role {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

export interface User {
  readonly id: number
  name: string
  roles: Role[]
}

export type Result<T, E extends Error = Error> = { ok: true; value: T } | { ok: false; error: E }

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'HttpError'
  }
}

@sealed
export class UserRepository<T extends User> {
  private cache = new Map<number, T>()

  static create(): UserRepository<User> {
    return new UserRepository()
  }

  async get(id: number): Promise<T | undefined> {
    return this.cache.get(id) ?? undefined
  }
}

export async function fetchUser(id: number, options: { retries: number }): Promise<User> {
  for (let attempt = 0; attempt < options.retries; attempt++) {
    const response = await fetch(`/api/users/${id}`)
    if (response.ok) return (await response.json()) as User
  }
  throw new HttpError(500, 'Request failed')
}

function sealed(constructor: Function) {
  Object.seal(constructor)
}
