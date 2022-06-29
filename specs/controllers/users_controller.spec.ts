import * as helper from '../helper'
import request from 'supertest'
import app, { prisma } from '@App/app'

let response: request.Response

afterEach(async () => {
  // await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`
  await helper.truncateTable('User')
})

describe('POST /users', () => {
  describe('when everything is good', () => {
    beforeEach(async () => {
      response = await request(app).post('/users').send({
        user: {
          name: 'John',
          lastName: 'Doe',
          email: 'john.doe@test.ex',
          bornedAt: '01/01/2000'
        },
        auth: {
          password: 'password'
        }
      })
    })

    it('returns a 201', () => {
      expect(response.status).toEqual(201)
    })

    it('creates a new user', async () => {
      const id = response.body.result.id
      expect(await prisma.user.findUnique({ where: { id: id } })).toBeDefined()
    })
  })

  describe('when there are missing parameters', () => {
    beforeEach(async () => {
      response = await request(app).post('/users').send({
        user: { name: 'John', lastName: 'Doe', bornedAt: '01/01/2020' },
        auth: { password: 'password' }
      })
    })

    it('returns a 422', () => {
      expect(response.status).toEqual(422)
    })

    it('returns a list of missing parameters', () => {
      expect(response.body.errors).toMatchObject([
        {
          attribute: 'email',
          message: "Missing attribute: 'email'"
        }
      ])
    })
  })
})
