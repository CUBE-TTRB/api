import { Type } from '@prisma/client'
import StdResource from '../std_resource'
import { ActivityValidator } from './activity_validator'
import { ArticleValidator } from './article_validator'

export class ResourceValidator {
  readonly resource: Readonly<StdResource>

  constructor (resource: Readonly<StdResource>) {
    this.resource = resource
  }

  validate () {
    switch (this.resource.type) {
      case Type.ARTICLE:
        return new ArticleValidator(this.resource).validate()
      case Type.ACTIVITY:
        return new ActivityValidator(this.resource).validate()
    }
  }
}
