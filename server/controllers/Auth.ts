import passport from 'passport'
import type { Pool } from 'pg'
import type { Express } from 'express'
import { clearCookies, handleAuthJWT } from '../utils/authJWT'

const BASE = `/auth`

export const AuthController = (app: Express, pool: Pool) => {
  // SIGN UP
  app.post(
    `${BASE}/signup`,
    passport.authenticate('local-signup', { session: true }),
    (req, res, next) => {
      // apply JWT with user data
      // as cookie
      const payload = { user: req.user }
      handleAuthJWT({ req, res, payload })

      // return success res
      // since user has successfully
      // signed up
      res.json({
        auth: true,
        success: true,
        user: req.user,
      })
    },
  )

  // LOGIN
  app.post(
    `${BASE}/login`,
    passport.authenticate('local-login', { session: true }),
    (req, res, next) => {
      // apply JWT with user data
      // as cookie
      const payload = { user: req.user }
      handleAuthJWT({ req, res, payload })

      // return success res
      // since user has successfully
      // signed up
      res.json({
        auth: true,
        success: true,
        user: req.user,
      })
    },
  )

  // To destroy the session we use this endpoint
  app.get(`${BASE}/logout`, (req: any, res) => {
    // req.logout() // passport funct?
    req.session.destroy()
    clearCookies({ res })
    res.send({ logout: 'SUCCESS', success: true })
  })
}
