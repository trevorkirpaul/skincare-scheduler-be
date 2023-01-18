import type { Pool } from 'pg'
import type { Express } from 'express'

const BASE = '/scheduled-products'

export const ScheduledProductsController = (app: Express, pool: Pool) => {
  app.post(BASE, async ({ body }, res) => {
    const { productId, userId, day, isAm } = body
    const text = `
      INSERT INTO scheduled_products(product_id, user_id, day, is_am)
      VALUES(${productId}, ${userId}, '${day}', ${isAm})
      RETURNING id;
    `
    const newScheduledProduct = await pool.query(text)

    try {
      const foundScheduledProductOrder = await pool.query(
        `
        SELECT * FROM scheduled_product_orders
        WHERE scheduled_product_orders.user_id = ${userId} AND scheduled_product_orders.day = '${day}'
      `,
      )

      if (foundScheduledProductOrder.rows.length === 0) {
        const newScheduledProductOrderText = `INSERT INTO scheduled_product_orders(user_id, day, scheduled_product_ids) VALUES($1, $2, $3)`

        const newScheduledProductOrderValues = [
          userId,
          day,
          [newScheduledProduct.rows[0].id],
        ]

        const newScheduledProductOrder = await pool.query(
          newScheduledProductOrderText,
          newScheduledProductOrderValues,
        )
        return res.status(201).send(newScheduledProduct)
      } else {
        const updatedScheduledProductOrderText = `
          UPDATE scheduled_product_orders
          SET scheduled_product_ids = scheduled_product_ids || ${newScheduledProduct.rows[0].id}
          WHERE scheduled_product_orders.id = ${foundScheduledProductOrder.rows[0].id}
        `
        const updatedScheduledProductOrder = await pool.query(
          updatedScheduledProductOrderText,
        )
      }
      return res.status(201).send(newScheduledProduct)
    } catch (e) {
      console.log(
        'ERROR: There was an error trying to find the scheduled products order for the day.',
        e,
      )
      return res.status(201).send(newScheduledProduct)
    }
  })

  app.delete(`${BASE}/:id`, async ({ params }, res) => {
    const text = `
      DELETE FROM scheduled_products
      WHERE id = ${params.id}
      RETURNING *;
    `
    const deletedResponse = await pool.query(text)

    // update scheduled_product_order
    const updateScheduledProductOrderText = `
      UPDATE scheduled_product_orders
      SET scheduled_product_ids = array_remove(scheduled_product_ids, ${deletedResponse.rows[0].id})
      WHERE scheduled_product_orders.user_id = ${deletedResponse.rows[0].user_id}
      AND scheduled_product_orders.day = '${deletedResponse.rows[0].day}';
    `
    const updatedScheduledProductOrderResponse = await pool.query(
      updateScheduledProductOrderText,
    )

    return res.status(204).send(deletedResponse)
  })
}
