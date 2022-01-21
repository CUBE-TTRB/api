import express from 'express'
import morgan from 'morgan'
import router from './config/routes'

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use('/', router)

// TODO: Add error handling for the server (ports, permissions, etc).
// (see old `bin/server`)
const port = 3000
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`)
})
