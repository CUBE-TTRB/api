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
      case Type.EXERCISE:
        this.validateAsExercice(resource)
        break
      case Type.BOOKLET:
        this.validateAsBooklet(resource)
        break
      case Type.CHALLENGE_CARD:
        this.validateAsChallengeCard(resource)
        break
      case Type.COURSE:
        this.validateAsPdfCourse(resource)
        break
      case Type.VIDEO:
        this.validateAsVideo(resource)
        break
      case Type.VIDEOGAME:
        this.validateAsVideoGame(resource)
        break
      default:
        resource.errors.push({
          attribute: 'type',
          message: `Unknown resource type: '${resource.type}'`
        })
    }
  }

  private validateAsArticle (resource: Resource) {
    validatePresence(resource, 'userId')
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
    validatePresence(resource, 'userId')
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

  private validateAsChallengeCard (resource: Resource) {
    validatePresence(resource, 'userId')
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

  private validateAsExercice (resource: Resource) {
    validatePresence(resource, 'userId')
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

  private validateAsBooklet (resource: Resource) {
    validatePresence(resource, 'userId')
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

  private validateAsPdfCourse (resource: Resource) {
    validatePresence(resource, 'userId')
    validatePresence(resource, 'title')
    validatePresence(resource, 'body')
    validatePresence(resource, 'link')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
  }

  private validateAsOnlineGame (resource: Resource) {
    validatePresence(resource, 'userId')
    validatePresence(resource, 'title')
    validatePresence(resource, 'body')
    validatePresence(resource, 'link')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
  }

  private validateAsVideo (resource: Resource) {
    validatePresence(resource, 'userId')
    validatePresence(resource, 'title')
    validatePresence(resource, 'link')
    validatePresence(resource, 'body')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
  }

  private validateAsVideoGame (resource: Resource) {
    validatePresence(resource, 'userId')
    validatePresence(resource, 'title')
    validatePresence(resource, 'link')
    validatePresence(resource, 'body')
    validatePresence(resource, 'visibility')
    validateInclusion(resource, 'visibility', [
      Visibility.PRIVATE,
      Visibility.SHARED,
      Visibility.PUBLIC
    ])
    validatePresence(resource, 'categoryId')
  }
}
