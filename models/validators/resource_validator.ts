import { AbstractResource } from '../abstract_resource'

export type ValidationError = {
  attribute: string
  message: string
}

export class ResourceValidator {
  readonly resource: Readonly<AbstractResource>
  readonly errors: Array<ValidationError>

  constructor (resource: Readonly<AbstractResource>) {
    this.resource = resource
    this.errors = []
  }

  protected validatePresence (attributeName: any) {
    const resource = this.resource as any
    if (resource[attributeName] === null || resource[attributeName] === undefined) {
      this.errors.push({
        attribute: attributeName,
        message: `Missing attribute: '${attributeName}'`
      })
    }
  }

  protected validateInclusion (attributeName: string, set: any[]) {
    const resource = this.resource as any
    if (!set.includes(resource[attributeName])) {
      this.errors.push({
        attribute: attributeName,
        message: `Attribute '${attributeName}' must be one of ${set}`
      })
    }
  }
}
