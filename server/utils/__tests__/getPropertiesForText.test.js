import { getPropertiesForText } from '../createTables'

const propertiesForProductsTable = [
  {
    name: 'name',
    type: 'TEXT',
    notNull: true,
  },

  {
    name: 'brand',
    type: 'TEXT',
    notNull: true,
  },
  {
    name: 'ingredients',
    type: 'TEXT',
    isArray: true,
  },
  {
    name: 'type',
    type: 'TEXT',
    notNull: true,
  },
]

describe('getPropertiesForText', () => {
  /**
   * This tests a util function which we use
   * when dynamically checking and creating tables in the db
   */
  it('return computed properties for products table', () => {
    const t = getPropertiesForText(propertiesForProductsTable)
    expect(t).toBe(
      'id SERIAL PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL, ingredients TEXT[], type TEXT NOT NULL',
    )
    // expect(t).toBe(
    //   'CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL, ingredients TEXT[], type TEXT NOT NULL);',
    // )
  })
})
