import Mongoose from 'mongoose'

/**
 * name
 * ingredients
 * type
 */
const Schema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  ingredients: [String],
  type: {
    type: String,
  },
})

const Product = Mongoose.model('Product', Schema)

export default Product
