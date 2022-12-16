import paginate from 'express-paginate'

import Product from '../models/Product'

import productsJSON from '../data/products.json'

const BASE = '/products'

export const ProductsController = (app) => {
  app.get(BASE, async (req, res) => {
    console.log('req.query', req.query)
    const { limit = 10, skip = 0, search } = req.query
    const products = await Product.find().limit(limit).skip(skip)
    const pageCount = Math.ceil((await Product.count()) / limit)

    res.status(200).send({
      pageCount,
      products,
    })
  })

  app.post(`${BASE}`, async ({ body }, res) => {
    try {
      const newProduct = await Product.create(body)
      res.status(201).send(newProduct)
    } catch (error) {
      res.status(400).send({ error: true, message: 'error' })
    }
  })

  app.post(`${BASE}/seed`, async (req, res) => {
    return res.send({ blocked: true })
    const parsedProducts = productsJSON.map(async (product, i) => {
      await Product.create({
        name: product.name,
        brand: product.brand,
        ingredients: product.ingredient_list,
      }).then(() => console.log('index', i))
    })
    res.send(productsJSON)
  })
}
