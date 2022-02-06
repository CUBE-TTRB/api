import { Resource, Visibility, State, Type, PrismaClient } from '@prisma/client'

type ValidationError = {
  attribute: string
  message: string
}

export abstract class AbstractResource implements Partial<Resource> {
  id?: number
  visibility: Visibility
  state: State
  type: Type
  categoryId?: number
  title?: string
  body?: string
  date?: Date
  location?: string

  constructor (initiator: any) {
    // /!\ Do not make assumptions about the values here as the constructor may
    // be used to instanciate objects for already existing records.
    // Leverage the custom validators to ensure data integrity at an application
    // level.

    this.id = initiator?.id
    this.visibility = initiator?.visibility
    this.state = initiator?.state || State.SUBMITTED
    this.type = initiator?.type
    this.categoryId = initiator?.categoryId
    this.title = initiator?.title
    this.body = initiator?.body
    this.date = initiator?.date
    this.location = initiator?.location
  }

  setAttributes () {

  }

  async save () {
    new PrismaClient().resource.upsert({
      where: { id: this.id },
      create: this,
      update: this
    })
  }
}

export class Article extends AbstractResource implements Partial<Resource> {
  static permitParams (initiator: any): any {
    if (initiator === null || initiator === undefined) return {}

    const permittedParams = [
      'visibility',
      'state',
      'title',
      'body',
      'categoryId'
    ]

    return Object.fromEntries(Object.entries(initiator).filter(([key, _]) => {
      return permittedParams.includes(key)
    }))
  }

  constructor (initiator: any) {
    super(initiator)
    this.type = Type.ARTICLE
  }
}

class ResourceValidator {
  readonly resource: Readonly<AbstractResource>
  readonly errors: Array<ValidationError>

  constructor (resource: Readonly<AbstractResource>) {
    this.resource = resource
    this.errors = []
  }

  protected validateAttributePresence (attributeName: any) {
    const resource = this.resource as any
    if (resource[attributeName] === null || resource[attributeName] === undefined) {
      this.errors.push({
        attribute: attributeName,
        message: `Missing attribute: '${attributeName}'`
      })
    }
  }
}

export class ArticleValidator extends ResourceValidator {
  validate (): Boolean {
    this.validateAttributePresence('title')
    this.validateAttributePresence('body')
    this.validateAttributePresence('visibility')
    return this.errors.length === 0
  }
}
