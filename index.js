const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

// MIDDLEWARE

const cors = require('cors')
app.use(cors())

morgan.token('body', req => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
)

app.use(express.static('build'))

let contacts = [
  {
    "name": "Arto Hellas",
    "phone": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "phone": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "phone": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "phone": "39-23-6423122",
    "id": 4
  }
]

// GET

app.get('/', (req, res) => {
  res.send('<h1>Phonebook App</h1>')
})

app.get('/info', (req, res) => {
  const entries = contacts.length
  const date = new Date()
  res.send(`
  <p>Phonebook has a total of ${entries} entries</p>
  <p>${date}</p>
  `)
})

app.get('/api/contacts', (req, res) => {
  res.json(contacts)
})

app.get('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  const contact = contacts.find(entry => entry.id === id)
  if (contact) {
    res.json(contact)
  } else {
    res.status(404).end()
  }
})

// DELETE

app.delete('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id)
  contacts = contacts.filter(entry => entry.id !== id)
  res.status(204).end()
})

// POST

const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
}

app.post('/api/contacts', (req, res) => {
  const { name, phone } = req.body
  const names = contacts.map(entry => entry.name)

  if (!name) {
    return res.status(404).json({
      error: 'name is missing'
    })
  }

  if (!phone) {
    return res.status(404).json({
      error: 'phone number is missing'
    })
  }

  if (names.includes(name)) {
    return res.status(409).json({
      error: 'contact already exist'
    })
  }

  const entry = {
    name: name,
    phone: phone,
    id: generateId(),
  }

  contacts = contacts.concat(entry)
  res.json(entry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})