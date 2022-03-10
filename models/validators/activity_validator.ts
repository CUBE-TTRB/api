import { Visibility } from '@prisma/client'
import StdResource from '../std_resource'
import { validateInclusion, validatePresence } from './predicates'

export class ActivityValidator {
  private _resource: StdResource

  constructor (resource: StdResource) {
    this._resource = resource
  }

  validate (): Boolean {
    validatePresence(this._resource, 'title')
    validatePresence(this._resource, 'date')
    validatePresence(this._resource, 'location')
    validatePresence(this._resource, 'visibility')
    validateInclusion(this._resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ]) // no Visibility.all() or other... T-T
    return this._resource.errors.length === 0
  }
}
