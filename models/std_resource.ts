import { Resource, Visibility, State, Type, Category } from '@prisma/client'
import { prisma } from '../app'
import { ResourceValidator } from './validators/resource_validator'

export default class StdResource implements Partial<Resource> {
  id?: number
  visibility: Visibility
  state: State
  type: Type
  categoryId?: number
  title?: string
  body?: string
  date?: Date
  location?: string
  errors: string[]

  static async all (): Promise<StdResource[]> {
    const records = await prisma.resource.findMany()
    return records as StdResource[]
  }

  static async defaultCategoryId () {
    // Can't use `findUnique`because... reasons...
    const category = await prisma.category.findFirst({ where: { default: true } }) as unknown as Category
    return category.id
  }

  constructor (initiator: any) {
    // /!\ Do not make assumptions about the values here as the constructor may
    // be used to instanciate objects for already existing records.
    // Leverage the custom validators to ensure data integrity at an application
    // level.

    this.id = initiator?.id
    this.visibility = initiator?.visibility
    this.state = initiator?.state ?? State.SUBMITTED
    this.type = initiator?.type
    this.categoryId = initiator?.categoryId
    this.title = initiator?.title
    this.body = initiator?.body
    this.date = new Date(initiator?.date)
    this.location = initiator?.location
    this.errors = []
  }

  setAttributes (attributes: any) {
    const entries = Object.entries(this).map(el => el[0])
    for (const key in attributes) {
      if (entries.includes(key)) {
        this[key as keyof this] = attributes[key]
      }
    }
  }

  async save (): Promise<void> {
    // HACK: this affectation should happen earlier in the constructor but
    // constructors can't be async ._.
    this.categoryId ??= await StdResource.defaultCategoryId()

    if (this.id === undefined) {
      await prisma.resource.create({ data: this as Resource })
    } else {
      await prisma.resource.update({ where: { id: this.id }, data: this })
    }
  }

  async update (attributes: any) {
    this.setAttributes(attributes)
    this.save()
  }

  async destroy () {
    return await prisma.resource.delete({
      where: { id: this.id }
    })
  }

  isValid () {
    const validator = new ResourceValidator(this)
    return validator.validate()
  }
}
