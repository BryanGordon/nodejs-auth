import DBLocal from 'db-local'
import crypto from 'crypto'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, requiered: true },
  username: { type: String, requiered: true },
  password: { type: String, requiered: true }
})

export class UserRepository {
  static create ({ username, password }) {
    // Usar biblioteca de validaciones llamada zod
    // Primero se usan validaciones
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')

    if (typeof password !== 'string') throw new Error('password must be a string ')
    if (password.length < 5) throw new Error('password must be have more than 4 characters')

    // Asegurarse que le username no existe
    const user = User.findOne({ username })
    if (user) throw new Error('username alredy exist')

    const id = crypto.randomUUID()

    User.create({
      _id: id,
      username,
      password
    }).save()

    return id
  }

  static login ({ username, password }) {}
}
