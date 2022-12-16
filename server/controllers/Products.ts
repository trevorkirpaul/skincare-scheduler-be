import type { Express } from 'express'
import type { Pool } from 'pg'

import productsJSON from '../data/products.json'

const BASE = '/products'

export const ProductsController = (app: Express, pool: Pool) => {
  app.get(BASE, async (req, res) => {
    const { limit = 10, skip = 0, search } = req.query
    const safeLimit = limit > 25 ? 25 : limit
    const searchQueryIfAvail =
      typeof search === 'string' && search.length > 0
        ? ` WHERE (brand,name,ingredients)::text LIKE '%${search}%' `
        : ' '

    const pgText = `SELECT * FROM products${searchQueryIfAvail}LIMIT ${safeLimit} OFFSET ${skip}`
    const pgProducts = await pool.query(pgText)

    res.status(200).send(pgProducts)
  })

  app.post(`${BASE}`, async ({ body }, res) => {
    try {
      const text =
        'INSERT INTO products(name, brand, ingredients, type) VALUES($1, $2, $3, $4) RETURNING *'
      const { name, brand, ingredients, type } = body
      const values = [name, brand, ingredients, type]

      const dbResponse = await pool.query(text, values)
      res.status(201).send(dbResponse)
    } catch (error) {
      res.status(400).send({ error: true, message: 'error' })
    }
  })

  app.post(`${BASE}/seed`, async (req, res) => {
    /**
     * @IMPORTANT
     *
     * DO NOT REMOVE THE RETURN UNLESS YOU WANT TO SEED THE DB
     */
    return res.send({ blocked: true })
    const parsedProducts = productsJSON.map(async (product, i) => {
      // POSTGRES
      const text =
        'INSERT INTO products(name, brand, ingredients, type) VALUES($1, $2, $3, $4) RETURNING *'

      const { name, brand, ingredient_list: ingredients } = product

      const values = [name, brand, ingredients, 'unknown']

      setTimeout(async () => {
        await pool.query(text, values)
        console.log(`item ${i + 1} of ${productsJSON.length + 1}`)
      }, (i + 1) * 100)

      // MONGOOSE / MONGODB
      // await Product.create({
      //   name: product.name,
      //   brand: product.brand,
      //   ingredients: product.ingredient_list,
      // }).then(() => console.log('index', i))
    })
    res.send('good luck')
    // res.send(productsJSON)
  })
}
