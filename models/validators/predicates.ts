export class InvalidRecordError extends Error {}

export class ValidationError {
  attribute?: string
  message?: string
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
