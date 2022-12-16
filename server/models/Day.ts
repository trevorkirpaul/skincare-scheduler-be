import Mongoose from 'mongoose'

const Schema = new Mongoose.Schema({
  day: {
    required: true,
    type: String,
  },
  products: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'ScheduledProduct',
    },
  ],
})

const Day = Mongoose.model('Day', Schema)

export default Day
