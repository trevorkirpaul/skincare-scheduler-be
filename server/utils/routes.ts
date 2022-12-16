import { ProductsController } from '../controllers/Products'
import { UserController } from '../controllers/User'
const Routes = (app) => {
  ProductsController(app)
  UserController(app)

  app.get('/', (req, res) => {
    res.send({ message: 'Works!' })
  })
}

export default Routes
