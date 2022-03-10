export function validatePresence (resource: any, attributeName: any) {
  if (resource[attributeName] === null || resource[attributeName] === undefined) {
    resource.errors.push({
      attribute: attributeName,
      message: `Missing attribute: '${attributeName}'`
    })
  }
}

export function validateInclusion (resource: any, attributeName: string, set: any[]) {
  if (!set.includes(resource[attributeName])) {
    resource.errors.push({
      attribute: attributeName,
      message: `Attribute '${attributeName}' must be one of ${set}`
    })
  }
}
