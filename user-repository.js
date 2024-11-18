import DBLocal from 'db-local'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, requiered: true },
  username: { type: String, requiered: true },
  password: { type: String, requiered: true }
})

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('password must be a string ')
    if (password.length < 5) throw new Error('password must be have more than 5 characters')
  }
}

export class UserRepository {
  static create ({ username, password }) {
    // Usar biblioteca de validaciones llamada zod
    // Primero se usan validaciones
    Validation.username(username)
    Validation.password(password)

    // Asegurarse que le username no existe
    const user = User.findOne({ username })
    if (user) throw new Error('username alredy exist')

    const id = crypto.randomUUID()
    // Se ha una encriptacion de la contraseña
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Username does not exist')

    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) throw new Error('Password is invalid')

    const { password: privateUser, ...publicUser } = user

    return publicUser
  }
}
