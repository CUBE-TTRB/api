import ApplicationValidator from './application_validator'
import { validatePresence } from './predicates'

export class AttachedFileValidator extends ApplicationValidator {
  validate () {
    validatePresence(this.model, 'key')
    validatePresence(this.model, 'contentType')
    validatePresence(this.model, 'resourceId')
  }
}
