import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import parseRouter from './routers/parse'

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3000)

// Example route:
app.use('/parse', parseRouter)

export default app
