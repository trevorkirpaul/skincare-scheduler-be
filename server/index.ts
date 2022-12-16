import express from 'express'
import cors from 'cors'
import { connectToDB } from './utils/db'
import Routes from './utils/routes'

const createServer = () => {
  const app = express()
  const port = 3001

  connectToDB()

  app.use(cors())
  app.use(express.json())

  Routes(app)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export { createServer }
