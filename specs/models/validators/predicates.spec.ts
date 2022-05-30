import 'jest'
import ApplicationModel from '@App/models/application_model'
import * as predicates from '@App/models/validators/predicates'

// Dummy model
class Hat extends ApplicationModel {
  static COLORS: string[] = ['blue', 'orange', 'white']

  color: any
  createdAt: any

  constructor (color?: string, createdAt?: Date) {
    super()
    this.color = color || Hat.COLORS[Math.floor(Math.random() * Hat.COLORS.length)]
    this.createdAt = createdAt || new Date()
  }
}

// Reset model for each test
let hat: Hat
beforeEach(() => {
  hat = new Hat()
})

describe('#validatePresence', () => {
  describe('when the given attribute is null', () => {
    beforeEach(() => {
      hat.color = null
    })

    it('adds an error on the model', () => {
      predicates.validatePresence(hat, 'color')
      expect(hat.errors).toContainEqual({
        attribute: 'color',
        message: "Missing attribute: 'color'"
      })
    })
  })

  describe('when the given attribute is undefined', () => {
    beforeEach(() => {
      hat.color = undefined
    })

    it('adds an error on the model', () => {
      predicates.validatePresence(hat, 'color')
      expect(hat.errors).toContainEqual({
        attribute: 'color',
        message: "Missing attribute: 'color'"
      })
    })
  })

  describe('when the given attribute is present', () => {
    beforeEach(() => {
      hat.color = 'redAsTheBloodOfMyEnemies'
    })

    it('does not add an error on the model', () => {
      predicates.validatePresence(hat, 'color')
      expect(hat.errors).toEqual([])
    })
  })
})

describe('#validateInclusion', () => {
  describe('when the given attribute is not in the inclusion list', () => {
    beforeEach(() => {
      hat.color = 'pink'
    })

    it('adds an error on the model', () => {
      predicates.validateInclusion(hat, 'color', Hat.COLORS)
      expect(hat.errors).toContainEqual({
        attribute: 'color',
        message: `Attribute 'color' must be one of ${Hat.COLORS}`
      })
    })
  })

  describe('when the given attribute is in the inclusion list', () => {
    beforeEach(() => {
      hat.color = 'orange'
    })

    it('does not add errors on the model', () => {
      predicates.validateInclusion(hat, 'color', Hat.COLORS)
      expect(hat.errors).toEqual([])
    })
  })
})

describe('#validateDateFormat', () => {
  describe('when the given attribute is not a date', () => {
    beforeEach(() => { hat.createdAt = 'not a date' })

    it('adds an error on the model', () => {
      predicates.validateDateFormat(hat, ['createdAt'])
      expect(hat.errors).toContainEqual({
        attribute: 'createdAt',
        message: "Attribute 'createdAt' : Date parse error"
      })
    })
  })

  describe('when the given attribute is a date', () => {
    it('does not add errors on the model', () => {
      predicates.validateDateFormat(hat, ['createdAt'])
      expect(hat.errors).toEqual([])
    })
  })
})

describe('#validateGreaterThanToday', () => {
  describe('when the given date is not greater than today', () => {
    beforeEach(() => { hat.createdAt = new Date('1999-09-27') })

    it('adds an error on the model', () => {
      predicates.validateDateGreaterThanToday(hat, ['createdAt'])
      expect(hat.errors).toContainEqual({
        attribute: 'createdAt',
        message: "Attribute 'createdAt' need to be greater than today"
      })
    })
  })

  describe('when the given attribute is a date greater than today', () => {
    beforeEach(() => { hat.createdAt = new Date('2054-01-01') })

    it('does not add errors on the model', () => {
      predicates.validateDateGreaterThanToday(hat, ['createdAt'])
      expect(hat.errors).toEqual([])
    })
  })
})
