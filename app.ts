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

// TODO: Add error handling for the server (ports, permissions, etc).
// (see old `bin/server`)
const port = 3000
app.listen(port, () => {
  console.log(`Node is running with NODE_ENV=${process.env.NODE_ENV}`)
  console.log(`Express is listening on http://localhost:${port}`)
})
