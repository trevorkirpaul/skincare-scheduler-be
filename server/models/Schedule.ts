import Mongoose from 'mongoose'

const Schema = new Mongoose.Schema({
  days: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Day',
    },
  ],
  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const Schedule = Mongoose.model('Schedule', Schema)

export default Schedule
