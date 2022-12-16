import express from 'express'
import cors from 'cors'
import { Pool, Client } from 'pg'
import { connectToDB } from './utils/db'
import Routes from './utils/routes'

const createServer = () => {
  const { VITE_PG_URL: connectionString } = process.env

  if (!connectionString) {
    throw new Error('PG_URL is undefined, check your ENV vars')
  }
  // --- POSTGRES ---

  // pools will use environment variables
  // for connection information
  const databaseConfig = { connectionString }
  const pool = new Pool(databaseConfig)

  // --- MONGO DB ---
  const app = express()
  const port = 3001

  connectToDB()

  app.use(cors())
  app.use(express.json())

  Routes(app, pool)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export { createServer }
