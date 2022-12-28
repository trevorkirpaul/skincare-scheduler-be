import type { Pool } from 'pg'

interface IArgs {
  pool: Pool
  tablesToCreate?: TableToCreate[]
}

interface TableProperties {
  name: string
  type: string
  notNull?: boolean
  isArray?: boolean
}

interface TableToCreate {
  name: string
  properties: TableProperties[]
}

export const getPropertiesForText = (properties: TableProperties[]) => {
  return properties.reduce((prev, { name, type, notNull, isArray }) => {
    const computedType = isArray ? `${type}[]` : `${type}`

    return `${prev}, ${name} ${computedType}${notNull ? ' NOT NULL' : ''}`
  }, 'id SERIAL PRIMARY KEY')
}

/**
 * bootstraps tables
 * if they don't exist
 */
const createTables = async ({ pool }: IArgs): Promise<void> => {
  await pool.query(`
      BEGIN;

      CREATE TABLE IF NOT EXISTS products(
        id serial PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        ingredients TEXT[],
        type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS scheduled_products(
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        user_id INTEGER REFERENCES users(id),
        day TEXT NOT NULL,
        is_am BOOLEAN NOT NULL
      );

      COMMIT;
    `)
}

export default createTables
