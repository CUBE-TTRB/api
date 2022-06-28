import { Role } from '@prisma/client'
import { prisma } from '../app'
import ApplicationModel, { Model } from './application_model'
import UserValidator from './validators/user_validator'

export default class User extends ApplicationModel implements Model {
  constructor (initiator: any) {
    super()
    this.prismaModelClient = prisma.user
    this.validator = new UserValidator(this)

    this.record = {
      id: initiator?.id,
      email: initiator?.email,
      name: initiator?.name,
      lastName: initiator?.lastName,
      role: initiator?.role ?? Role.USER,
      backgroundImage: initiator?.backgroundImage,
      bornedAt: new Date(initiator?.bornedAt),
      confirmedAt: new Date(initiator?.confirmedAt),
      createdAt: initiator?.createdAt,
      updatedAt: initiator?.updatedAt,
      profilePicture: initiator?.profilePicture
    }
  }

  get email (): string {
    return this.record.email
  }

  set email (value: string) {
    this.record.email = value
  }

  get profilePicture (): string {
    return this.record.profilePicture
  }

  set profilePicture (value: string) {
    this.record.profilePicture = value
  }

  get name (): string {
    return this.record.name
  }

  set name (value: string) {
    this.record.name = value
  }

  get lastName (): string {
    return this.record.lastName
  }

  set lastName (value: string) {
    this.record.lastName = value
  }

  get backgroundImage (): string {
    return this.record.backgroundImage
  }

  set backgroundImage (value: string) {
    this.record.backgroundImage = value
  }

  get bornedAt (): string {
    return this.record.bornedAt
  }

  set bornedAt (value: string) {
    this.record.bornedAt = value
  }

  get role (): Role {
    return this.record.role
  }

  set role (value: Role) {
    this.record.role = value
  }

  get confirmedAt (): Date {
    return this.record.confirmedAt
  }
}
