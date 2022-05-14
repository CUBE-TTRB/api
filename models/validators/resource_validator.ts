import { Type, Visibility } from '@prisma/client'
import Resource from '../resource'
import ApplicationValidator from './application_validator'
import { validateDateFormat, validateDateGreaterThanToday, validateInclusion, validatePresence } from './predicates'

export class ResourceValidator extends ApplicationValidator {
  validate () {
    const resource = this.model as Resource
    switch (resource.type) {
      case Type.ARTICLE:
        this.validateAsArticle(resource)
        break
      case Type.ACTIVITY:
        this.validateAsActivity(resource)
        break
      default:
        resource.errors.push({
          attribute: 'type',
          message: `Unknown resource type: '${resource.type}'`
        })
    }
  }

  private validateAsArticle (resource: Resource) {
    validatePresence(resource, 'title')
    validatePresence(resource, 'body')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
  }

  private validateAsActivity (resource: Resource) {
    validatePresence(resource, 'title')
    validatePresence(resource, 'date')
    validatePresence(resource, 'location')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
    validateDateFormat(resource, ['date'])
    validateDateGreaterThanToday(resource, ['date'])
  }
}
