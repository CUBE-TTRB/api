import 'module-alias/register'
import { PrismaClient } from '@prisma/client'
import express from 'express'
import morgan from 'morgan'
import router from './config/routes'

export const prisma = new PrismaClient({
  rejectOnNotFound: true
})

const app = express()
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
app.use(express.json())
app.use('/', router)

export default app
