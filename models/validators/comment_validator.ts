import Comment from '../comment'
import ApplicationValidator from './application_validator'
import { validatePresence } from './predicates'

export class CommentValidator extends ApplicationValidator {
  validate () {
    const comment = this.model as Comment
    validatePresence(comment, 'userId')
    validatePresence(comment, 'text')
    validatePresence(comment, 'resourceId')
  }
}
