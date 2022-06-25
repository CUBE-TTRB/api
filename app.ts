import { PrismaClient } from '@prisma/client'
import express from 'express'
import morgan from 'morgan'
import router from './config/routes'
import bodyParser from 'body-parser'

export const prisma = new PrismaClient({
  rejectOnNotFound: true
})

const app = express()
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
app.use(express.json({ limit: '25mb' }))
app.use('/', router)
app.use(express.urlencoded({ limit: '25mb', extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '25mb' }))

export default app
