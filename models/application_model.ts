import { InvalidRecordError } from './validators/predicates'

export interface Model {
  record: any
  errors: any[]
  readonly id: number
  readonly createdAt: Date
  readonly updatedAt: Date
  isValid(): Boolean
  save(): Promise<this>
  setAttributes(attributes: any): this
  update(attributes: any): Promise<this>
  destroy(): Promise<this>
}

export default abstract class ApplicationModel implements Model {
  record: any
  errors: any[] = []
  protected prismaModelClient: any
  protected validator: any

  get id (): number {
    return this.record.id
  }

  get createdAt (): Date {
    return this.record.createdAt
  }

  get updatedAt (): Date {
    return this.record.updatedAt
  }

  isValid () {
    this.validator.validate()
    return this.errors.length === 0
  }

  setAttributes (attributes: any) {
    const keys = Object.entries(this.record).map(keyVal => keyVal[0])
    for (const key in attributes) {
      if (keys.includes(key)) {
        this.record[key] = attributes[key]
      }
    }
    return this
  }

  async save () {
    if (!this.isValid()) {
      throw new InvalidRecordError(this.errors)
    }

    if (this.record.id === undefined) {
      this.record.createdAt = new Date()
      this.record.updatedAt = new Date()
      this.record = await this.prismaModelClient.create({ data: this.record })
    } else {
      this.record.updatedAt = new Date()
      this.record = await this.prismaModelClient.update({
        where: { id: this.record.id },
        data: this.record
      })
    }
    return this
  }

  async update (attributes: any) {
    this.setAttributes(attributes)
    return await this.save()
  }

  async destroy () {
    await this.prismaModelClient.delete({
      where: { id: this.record.id }
    })
    return this
  }
}
