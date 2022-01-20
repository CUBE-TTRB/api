const express = require('express')
const logger = require('morgan')
const router = require('./config/routes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use('/', router)

module.exports = app
