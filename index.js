require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Contact = require('./models/contact')

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
    'name': 'Arto Hellas',
    'phone': '040-123456',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'phone': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'phone': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'phone': '39-23-6423122',
    'id': 4
  }
]

// GET

app.get('/', (req, res) => {
  res.send('<h1>Phonebook App</h1>')
})

app.get('/info', (req, res) => {
  const date = new Date()
  Contact.countDocuments().then(result =>
    res.send(`
      <p>Phonebook has a total of ${result} entries</p>
      <p>${date}</p>
    `))
})

app.get('/api/contacts', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts.map(contact => contact.toJSON()))
  })
})

app.get('/api/contacts/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact.toJSON())
      }
      else {
        res.status(204).end()
      }
    })
    .catch(error => next(error))
})

// PUT

app.put('/api/contacts/:id', (req, res, next) => {
  const { name, phone } = req.body

  const contact = {
    name: name,
    phone: phone,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => {
      res.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

// DELETE

app.delete('/api/contacts/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// POST

app.post('/api/contacts', (req, res, next) => {
  const { name, phone } = req.body

  const contact = new Contact({
    name: name,
    phone: phone,
  })

  contact
    .save()
    .then(savedContact => savedContact.toJSON())
    .then(savedAndFormattedContact => {
      res.json(savedAndFormattedContact)
    })
    .catch(error => next(error))
})

// MIDDLEWARE to handle errors
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})