import type { Pool } from 'pg'
import type { Express } from 'express'
import User from '../models/User'
import Schedule from '../models/Schedule'
import Day from '../models/Day'
import ScheduledProduct from '../models/ScheduledProduct'

const BASE = '/users'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export const UserController = (app: Express, pool: Pool) => {
  app.get(`${BASE}/:id`, async ({ params: { id } }, res) => {
    const user = await User.findById(id)
      .populate('schedules')
      .populate({
        path: 'schedules',
        populate: {
          path: 'days',
          model: 'Day',
          populate: {
            path: 'products',
            model: 'ScheduledProduct',
            populate: {
              path: 'product',
              model: 'Product',
            },
          },
        },
      })
    res.status(200).send(user)
  })
  app.get(BASE, async (req, res) => {
    const users = await User.find()
    // .populate('schedules')
    // .populate({
    //   path: 'schedules',
    //   populate: {
    //     path: 'days',
    //     model: 'Day',
    //   },
    // })
    // .populate({
    //   path: 'schedules.days.products',
    //   model: 'days',
    //   populate: {
    //     path: 'products',
    //     model: 'ScheduledProduct',
    //   },
    // })
    res.status(200).send(users)
  })
  /**
   * --- CREATE NEW USER ---
   * - create new user
   * - create days and schedule then link them all
   * - return user
   */
  app.post(BASE, async (req, res) => {
    // --- POSTGRES ---
    // create day
    // const text = ``;
    // const values = []
    // const { body } = req

    // --- MONGO ----
    const newUser = await User.create(req.body)
    const createdDays = await Promise.all(
      days.map(
        async (day) =>
          await Day.create({
            day,
            products: [],
          }),
      ),
    )
    const newSchedule = await Schedule.create({
      user: newUser._id,
      days: createdDays.map((d) => d._id),
    })

    const updatedNewUser = await User.findByIdAndUpdate(newUser._id, {
      $addToSet: { schedules: newSchedule._id },
    })
    res.status(200).send(updatedNewUser)
  })

  app.post(`${BASE}/day/order`, async ({ body: { dayId, items } }, res) => {
    const updatedDay = await Day.findByIdAndUpdate(
      dayId,
      {
        $pullAll: { products: items },
      },
      { new: true },
    )

    const updatedDayWithUpdatedOrder = await Day.findByIdAndUpdate(
      dayId,
      {
        $addToSet: { products: items },
      },
      { new: true },
    )

    return res.status(200).send({
      updatedDay,
    })
  })

  app.post(`${BASE}/schedule`, async ({ body: { dayId, productId } }, res) => {
    const newScheduledProduct = await ScheduledProduct.create({
      day: dayId,
      amOrPm: 'AM',
      product: [productId],
    })

    const updatedDay = await Day.findByIdAndUpdate(
      dayId,
      {
        $addToSet: { products: newScheduledProduct._id },
      },
      { new: true },
    )

    return res.status(200).send({
      newScheduledProduct,
      updatedDay,
    })
  })

  app.delete(
    `${BASE}/schedule`,
    async ({ body: { dayId, productId } }, res) => {
      await ScheduledProduct.findByIdAndDelete(productId)
      const updatedDay = await Day.findByIdAndUpdate(
        dayId,
        {
          $pull: { products: productId },
        },
        { new: true },
      )
      return res.status(200).send({
        updatedDay,
      })
    },
  )
}
