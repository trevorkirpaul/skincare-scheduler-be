import type { Pool } from 'pg'

interface IArgs {
  pool: Pool
  shouldSeed?: boolean
}

const usersToCreate = ['admin@scs.com', 'user@scs.com']

const scheduledProductsToCreate = [
  {
    productId: '162',
    userId: '1',
    day: 'monday',
    isAm: true,
  },
  {
    productId: '162',
    userId: '1',
    day: 'tuesday',
    isAm: true,
  },
  {
    productId: '162',
    userId: '1',
    day: 'wednesday',
    isAm: true,
  },
  {
    productId: '162',
    userId: '1',
    day: 'thursday',
    isAm: true,
  },
  // {
  //   productId: '162',
  //   userId: '2',
  //   day: 'monday',
  //   isAm: true,
  // },
  // {
  //   productId: '162',
  //   userId: '2',
  //   day: 'tuesday',
  //   isAm: true,
  // },
  // {
  //   productId: '162',
  //   userId: '2',
  //   day: 'wednesday',
  //   isAm: true,
  // },
  // {
  //   productId: '162',
  //   userId: '2',
  //   day: 'thursday',
  //   isAm: true,
  // },
]

const seedUsersAndScheduledProducts = async ({
  pool,
  shouldSeed = false,
}: IArgs) => {
  if (!shouldSeed) return

  const createInsertQueryFor = (user: string) =>
    `
      INSERT INTO users(email)
      VALUES('${user}')
      RETURNING id;
    `

  const userResponse = await Promise.all(
    usersToCreate.map(async (userToCreate) => {
      return await pool.query(createInsertQueryFor(userToCreate))
    }),
  )

  console.log('userResponse', userResponse)

  const createScheduledProductInsertQueryFor = (
    sp: typeof scheduledProductsToCreate[number],
  ) => `
    INSERT INTO scheduled_products(product_id, user_id)
    VALUES('${sp.productId}', '${sp.userId}');
  `

  await Promise.all(
    scheduledProductsToCreate.map(async (sptc) => {
      await pool.query(createScheduledProductInsertQueryFor(sptc))
    }),
  )
}

export default seedUsersAndScheduledProducts
