import Mongoose, { ObjectId } from 'mongoose'

const Schema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  schedules: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
  ],
})

const User = Mongoose.model('User', Schema)

export default User
