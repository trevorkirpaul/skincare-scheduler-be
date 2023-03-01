import express from 'express'
import session from 'express-session'
import passport from 'passport'
import cors from 'cors'
import { Pool, Client } from 'pg'
import { connectToDB } from './utils/db'
import Routes from './utils/routes'
import createTables from './utils/createTables'
import seedUsersAndScheduledProducts from './utils/seedUsersAndScheduledProducts'
import { configurePassport } from './config/passport'

const createServer = async () => {
  const { VITE_PG_URL: connectionString } = process.env

  if (!connectionString) {
    throw new Error('PG_URL is undefined, check your ENV vars')
  }
  // --- POSTGRES ---

  // pools will use environment variables
  // for connection information
  const databaseConfig = { connectionString }
  const pool = new Pool(databaseConfig)
  await createTables({ pool })
  // await seedUsersAndScheduledProducts({ pool, shouldSeed: true })

  const app = express()
  const port = 3001

  app.use(cors())
  app.use(express.json())
  app.use(
    session({
      secret: 'keyboard cat', // @TODO: placeholder, update w/new value from env
      resave: false,
      saveUninitialized: false,
      store: new (require('connect-pg-simple')(session))({
        pool,
        createTableIfMissing: true,
      }),
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    }),
  )
  app.use(passport.authenticate('session'))
  configurePassport({ pool })
  Routes(app, pool)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export { createServer }
