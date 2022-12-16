import type { Express } from 'express'
import type { Pool } from 'pg'

import { ProductsController } from '../controllers/Products'
import { UserController } from '../controllers/User'

const Routes = (app: Express, pool: Pool) => {
  ProductsController(app, pool)
  UserController(app, pool)

  app.get('/', (req, res) => {
    res.send({ message: 'Works!' })
  })
}

export default Routes
