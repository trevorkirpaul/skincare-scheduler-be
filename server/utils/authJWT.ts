import jwt from 'jsonwebtoken'
import type { CookieOptions, Request, Response } from 'express'

// @TODO connect to env
const JWT_SECRET = 'this is for non prod only'

const createAuthJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET)
}

export interface IHandleAUthJWT {
  payload?: any
  req: Request
  res: Response
}

const options: any = {
  sameSite: 'none',
  secure: 'false',
}

/**
 * creates and applies a cookie to the response
 * with the given payload
 * Ideally, we want to store the user ID in there
 * for auth
 */
export const handleAuthJWT = ({ req, res, payload }: IHandleAUthJWT) => {
  if (!payload) {
    throw new Error('handleAuthJWT: empty payload')
  }
  return res.cookie('api-token', createAuthJWT(payload), options)
}

export const clearCookies = ({ res }: { res: Response }) =>
  res.clearCookie('api-token', options)
