import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

type StandardApiError = {
  attribute: string,
  message: string
}

export class PrismaErrorAdapter implements StandardApiError {
  attribute: string;
  message: string;

  constructor (prismaError: Readonly<any>) {
    // Default values
    this.attribute = 'base'
    this.message = prismaError.message

    if (prismaError instanceof PrismaClientKnownRequestError) {
      if (prismaError.code === 'P2002') { // Unique constraint
        const meta = prismaError?.meta as any
        const attributeName = meta?.target?.at(0)
        if (attributeName !== null && attributeName !== undefined) {
          this.attribute = attributeName
          this.message = `Unique constraint failed for '${attributeName}'`
        }
      }

      if (prismaError.code === 'P2003') { // Foreign key constraint
        const regexp = /^(?<table>.*)_(?<column>.*)_.*$/gm
        const meta = prismaError.meta as any
        const attributeName = regexp.exec(meta?.field_name)?.at(2)
        if (attributeName !== null && attributeName !== undefined) {
          this.attribute = attributeName
          this.message = `Foreign key constraint failed for '${attributeName}'`
        }
      }
    }
  }
}
