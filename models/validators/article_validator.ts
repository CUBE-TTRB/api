import { Visibility } from '@prisma/client'
import StdResource from '../std_resource'
import { validateInclusion, validatePresence } from './predicates'

export class ArticleValidator {
  private _resource: StdResource

  constructor (resource: StdResource) {
    this._resource = resource
  }

  validate (): Boolean {
    validatePresence(this._resource, 'title')
    validatePresence(this._resource, 'body')
    validatePresence(this._resource, 'visibility')
    validateInclusion(this._resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ]) // no Visibility.all() or other... T-T
    return this._resource.errors.length === 0
  }
}
