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
]

export const getPropertiesForText = (properties: TableProperties[]) => {
  return properties.reduce((prev, { name, type, notNull, isArray }) => {
    const computedType = isArray ? `${type}[]` : `${type}`

    return `${prev}, ${name} ${computedType}${notNull ? ' NOT NULL' : ''}`
  }, 'id SERIAL PRIMARY KEY')
}

const createTables = async ({
  pool,
  tablesToCreate = defaultTablesToCreate,
}: IArgs): Promise<void> => {
  tablesToCreate.map(async (tableToCreate) => {
    const { name, properties } = tableToCreate

    const text = `CREATE TABLE [IF NOT EXISTS] ${name} (${getPropertiesForText(
      properties,
    )});`
    await pool.query(text)
  })
}

export default createTables
