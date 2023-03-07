import LocalStrategy from 'passport-local'
import { Pool } from 'pg'
import passport from 'passport'

import { checkIfEmailExists, createUser, matchPassword } from '../utils/auth'

interface IConfigurePassport {
  pool: Pool
}

export const configurePassport = ({ pool }: IConfigurePassport) => {
  // sign up
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const userExists = await checkIfEmailExists({ email, pool })
          if (userExists) {
            return done(null, false)
          }
          const user = await createUser({ email, password, pool })
          return done(null, user)
        } catch (error) {
          done(error)
        }
      },
    ),
  )

  // login
  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await checkIfEmailExists({ email, pool })
          if (!user) return done(null, false)
          const isMatch = await matchPassword({
            password,
            hashPassword: user.password,
          })
          if (!isMatch) return done(null, false)
          return done(null, { id: user.id, email: user.email })
        } catch (error) {
          return done(error, false)
        }
      },
    ),
  )

  passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username })
    })
  })

  passport.deserializeUser(function (user: any, cb) {
    process.nextTick(function () {
      return cb(null, user)
    })
  })
}
