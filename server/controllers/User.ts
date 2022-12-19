import type { Pool } from 'pg'
import type { Express } from 'express'
import User from '../models/User'
import Schedule from '../models/Schedule'
import Day from '../models/Day'
import ScheduledProduct from '../models/ScheduledProduct'

const BASE = '/users'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export const UserController = (app: Express, pool: Pool) => {
  app.get(`${BASE}/:email`, async ({ params: { email } }, res) => {
    if (!email) {
      return res.status(400)
    }
    // const text = `SELECT * FROM users WHERE email = '${email}' `
    const text = `
    SELECT
    *
    FROM
      users
      INNER JOIN schedules ON user.id = schedule.user_id
    WHERE
      email = 'tkirpaul@gmail.com'
    `
    const dbResponse = await pool.query(text)
    return res.status(200).send(dbResponse)
  })
  app.get(BASE, async (req, res) => {
    const users = await User.find()
    res.status(200).send(users)
  })
  /**
   * --- CREATE NEW USER ---
   * - create new user
   * - create days and schedule then link them all
   * - return user
   */
  app.post(BASE, async ({ body }, res) => {
    const { email } = body
    const text = `INSERT INTO users(email) VALUES($1) RETURNING *`
    const values = [email]
    const dbResponse = await pool.query(text, values)
    res.status(201).send(dbResponse)
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
