import Mongoose from 'mongoose'

const createURI = (user, password) =>
  `mongodb+srv://${user}:${password}@cluster0.chcu6ia.mongodb.net/?retryWrites=true&w=majority`

export const connectToDB = async () => {
  const { VITE_MONGO_USERNAME = '', VITE_MONGO_PASSWORD = '' } = process.env

  const URI = createURI(VITE_MONGO_USERNAME, VITE_MONGO_PASSWORD)

  try {
    await Mongoose.connect(URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    console.log('DB: Connected')
  } catch (error) {
    console.log(error)
    throw new Error('connectToDB: Cata fail')
  }
}
