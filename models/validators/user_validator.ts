import ApplicationValidator from './application_validator'
import { validatePresence } from './predicates'

export default class UserValidator extends ApplicationValidator {
  validate () {
    const user = this.model as any
    validatePresence(user, 'email')
    validatePresence(user, 'name')
    validatePresence(user, 'role')
  }
}
