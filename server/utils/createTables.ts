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

const defaultTablesToCreate: TableToCreate[] = [
  {
    name: 'products',
    properties: [
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
    ],
  },
  {
    name: 'users',
    properties: [
      {
        name: 'email',
        type: 'TEXT',
        notNull: true,
      },
    ],
  },
  {
    name: 'schedules',
    properties: [
      {
        name: 'user_id',
        type: '',
      },
    ],
  },
]

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

      CREATE TABLE IF NOT EXISTS users(email TEXT NOT NULL, id SERIAL PRIMARY KEY);

      CREATE TABLE IF NOT EXISTS schedules(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS days(
        id SERIAL PRIMARY KEY,
        schedule_id INTEGER REFERENCES schedules(id),
        day TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS day_products(
        id SERIAL PRIMARY KEY,
        day_id INTEGER REFERENCES schedules(id),
        product_id INTEGER REFERENCES products(id),
        schedule_id INTEGER REFERENCES schedules(id),
        user_id INTEGER REFERENCES users(id)
      );

      COMMIT;
    `)
}

export default createTables
