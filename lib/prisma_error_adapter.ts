import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

type StandardApiError = {
  attribute: string,
  message: string
}

export class PrismaErrorAdapter implements StandardApiError {
  attribute: string;
  message: string;

  constructor (prismaError: Readonly<any>) {
    // Default values, jsut in case
    this.attribute = 'base'
    this.message = 'unknown error'

    if (prismaError instanceof PrismaClientKnownRequestError) {
      if (prismaError.code === 'P2003') { // Foreign Key constraint
        const regexp = /^(?<table>.*)_(?<column>.*)_.*$/gm
        const meta = prismaError.meta as any
        const attributeName = regexp.exec(meta?.field_name)?.at(2)
        if (attributeName !== null && attributeName !== undefined) {
          this.attribute = attributeName
          this.message = `Foreign key constraint failed for column: '${attributeName}'`
        }
      }
    }
  }
}
