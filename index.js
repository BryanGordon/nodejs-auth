import express from 'express'
import { PORT } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

// Endpoints
app.post('/login', (req, res) => {
  const { username, password } = req.body

  try {
    const user = UserRepository.login({ username, password })
    res.send({ user })
  } catch (e) {
    res.status(401).send(e.message)
  }
})

app.post('/register', (req, res) => {
  const { username, password } = req.body

  try {
    const id = UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {})

app.post('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
