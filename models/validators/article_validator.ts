import { Visibility } from '@prisma/client'
import { ResourceValidator } from './resource_validator'

export class ArticleValidator extends ResourceValidator {
  validate (): Boolean {
    this.validatePresence('title')
    this.validatePresence('body')
    this.validatePresence('visibility')
    this.validateInclusion('visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ]) // no Visibility.all() or other... T-T
    return this.errors.length === 0
  }
}
