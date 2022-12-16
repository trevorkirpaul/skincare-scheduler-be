import Mongoose from 'mongoose'

const Schema = new Mongoose.Schema({
  day: {
    required: true,
    type: String,
  },
  order: {
    // required: true,
    type: Number,
  },
  amOrPm: {
    required: true,
    type: String,
  },
  product: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
})

const ScheduledProduct = Mongoose.model('ScheduledProduct', Schema)

export default ScheduledProduct
