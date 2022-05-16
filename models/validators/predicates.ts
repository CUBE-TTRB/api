export class ValidationError {
  attribute?: string
  message?: string
}

export class InvalidRecordError extends Error {
  readonly errors: ValidationError[]

  constructor (errors: ValidationError[]) {
    super()
    this.errors = errors
  }
}

export function validatePresence (model: any, attributeName: any) {
  if (model[attributeName] === null || model[attributeName] === undefined) {
    model.errors.push({
      attribute: attributeName,
      message: `Missing attribute: '${attributeName}'`
    })
  }
}

export function validateInclusion (model: any, attributeName: any, set: any[]) {
  if (!set.includes(model[attributeName])) {
    model.errors.push({
      attribute: attributeName,
      message: `Attribute '${attributeName}' must be one of ${set}`
    })
  }
}

export function validateDateFormat (model: any, attributesNames: string[]) {
  attributesNames.forEach(attributeName => {
    if (isNaN(Date.parse(model[attributeName]))) {
      model.errors.push({
        attribute: attributeName,
        message: `Attribute '${attributeName}' : Date parse error`
      })
    }
  })
}

export function validateDateGreaterThanToday (model: any, attributesNames: string[]) {
  attributesNames.forEach(attributeName => {
    if (Date.parse(model[attributeName]) < new Date().getTime()) {
      model.errors.push({
        attribute: attributeName,
        message: `Attribute '${attributeName}' need to be greater than today`
      })
    }
  })
}
