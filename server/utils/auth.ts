import type { Pool } from 'pg'
import bcrypt from 'bcryptjs'

interface ICheckIfEmailExistsArgs {
  email?: string
  pool: Pool
}

/**
 * checks if the given `args.email` already exists in the DB
 * @returns boolean
 */
export const checkIfEmailExists = async ({
  email,
  pool,
}: ICheckIfEmailExistsArgs) => {
  const data = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  if (data.rowCount == 0) return false
  return data.rows[0]
}

interface ICreateUserArgs {
  email?: string
  password?: string
  pool: Pool
}

/**
 * --- CREATE NEW USER ---
 * - create new user
 * - create days and schedule then link them all
 * - return user
 */
export const createUser = async ({
  password,
  pool,
  email,
}: ICreateUserArgs) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const data = await pool.query(
      'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email, password',
      [email, hash],
    )
    if (data.rowCount == 0) return false
    return data.rows[0]
  } catch (e) {}
}

interface IMatchPasswordArgs {
  password?: string
  hashPassword?: string
}

/**
 * checks if the given pw matches the hashed pw
 */
export const matchPassword = async ({
  password,
  hashPassword,
}: IMatchPasswordArgs) => {
  const match = await bcrypt.compare(password, hashPassword)
  return match
}
