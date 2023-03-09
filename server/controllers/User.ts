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
    const text = `SELECT * FROM users WHERE email = '${email}'`
    const { rows } = await pool.query(text)

    res.status(200).send(rows[0])
  })
  app.get(`${BASE}/schedule/:email`, async ({ params: { email } }, res) => {
    if (!email) {
      // @TODO: ensure correct status code
      return res.status(400)
    }

    const text = `
      SELECT
        c.brand AS "brand",
        c.name AS "name",
        day,
        is_am,
        c.id AS "product_id",
        b.id AS "id"
      FROM users a
      JOIN (  
        SELECT product_id, user_id, day, is_am, id
        FROM scheduled_products
      ) b on b.user_id = a.id
      JOIN (
        SELECT name, id, brand
        FROM products
      ) c on c.id = b.product_id
      WHERE email = '${email}';
    `

    try {
      const { rows } = await pool.query(text)
      res.status(200).send(rows)
    } catch (e) {
      console.log('ERROR:', e)
    }
  })
  /**
   * --- CREATE NEW USER ---
   * - create new user
   * - create days and schedule then link them all
   * - return user
   */
  app.post(BASE, async ({ body }, res) => {
    const { email } = body
    //  create new user
    const text = `INSERT INTO users(email) VALUES($1) RETURNING *`
    const values = [email]
    const dbResponse = await pool.query(text, values)

    res.status(201).send(dbResponse)
  })

  app.get(`${BASE}/all_orders/:userId`, async ({ params: { userId } }, res) => {
    const updatedScheduledProductOrderText = `
          SELECT * FROM scheduled_product_orders
          WHERE scheduled_product_orders.user_id = ${userId};
        `
    const updatedScheduledProductOrderResponse = await pool.query(
      updatedScheduledProductOrderText,
    )

    return res.status(200).send(updatedScheduledProductOrderResponse.rows)
  })

  app.post(
    `${BASE}/day/order`,
    async ({ body: { day, items, userId, is_am } }, res) => {
      const isAmQuery = is_am ? 'true' : 'false'

      const updatedScheduledProductOrderText = `
          UPDATE scheduled_product_orders
          SET scheduled_product_ids = ($1)
          WHERE scheduled_product_orders.day = '${day}' AND scheduled_product_orders.user_id = ${userId} AND scheduled_product_orders.is_am = '${isAmQuery}'
          RETURNING *;
        `

      const updatedScheduledProductOrderValues = [items]
      const updatedScheduledProductOrderResponse = await pool.query(
        updatedScheduledProductOrderText,
        updatedScheduledProductOrderValues,
      )

      return res
        .status(200)
        .send(
          updatedScheduledProductOrderResponse.rows[0].scheduled_product_ids,
        )
    },
  )

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
