import passport from 'passport'
import type { Pool } from 'pg'
import type { Express } from 'express'

const BASE = `/auth`

export const AuthController = (app: Express, pool: Pool) => {
  // SIGN UP
  app.post(
    `${BASE}/signup`,
    passport.authenticate('local-signup', { session: false }),
    (req, res, next) => {
      res.json({
        user: req.user,
      })
    },
  )

  // LOGIN
  app.post(
    `${BASE}/login`,
    passport.authenticate('local-login', { session: false }),
    (req, res, next) => {
      res.json({ user: req.user })
    },
  )
}
