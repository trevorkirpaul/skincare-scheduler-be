import type { Pool } from 'pg'
import type { Express } from 'express'

const BASE = '/scheduled-products'

export const ScheduledProductsController = (app: Express, pool: Pool) => {
  app.post(BASE, async ({ body }, res) => {
    const { productId, userId, day, isAm } = body
    const text = `
      INSERT INTO scheduled_products(product_id, user_id, day, is_am)
      VALUES(
        '${productId}',
        '${userId}',
        '${day}',
        '${isAm}'
      )
      RETURNING *;
    `

    const newScheduledProductResponse = await pool.query(text)
    return res.status(201).send(newScheduledProductResponse)
  })

  app.delete(`${BASE}/:id`, async ({ params }, res) => {
    const text = `
      DELETE FROM scheduled_products
      WHERE id = ${params.id};
    `
    const deletedResponse = await pool.query(text)
    return res.status(204).send(deletedResponse)
  })
}
