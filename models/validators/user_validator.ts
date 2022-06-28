import ApplicationValidator from './application_validator'
import { validateDateFormat, validatePresence } from './predicates'

export default class UserValidator extends ApplicationValidator {
  validate () {
    const user = this.model as any
    validatePresence(user, 'email')
    validatePresence(user, 'name')
    validatePresence(user, 'lastName')
    validatePresence(user, 'role')
    validatePresence(user, 'bornedAt')
    validateDateFormat(user, 'bornedAt')
  }
}
