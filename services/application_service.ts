interface Service {
  errors: any[]
  call(): Promise<this> | this
  hasErrors(): Boolean
}

export abstract class ApplicationService implements Service {
  errors: any[]

  constructor () {
    this.errors = []
  }

  hasErrors (): Boolean {
    return this.errors.length > 0
  }

  abstract call (): Promise<this> | this
}
