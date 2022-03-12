import { Model } from '../application_model'

export default abstract class ApplicationValidator {
  protected model: Readonly<Model>

  constructor (model: Readonly<Model>) {
    this.model = model
  }

  abstract validate (): void
}
