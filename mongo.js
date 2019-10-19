// run: node mongo.js password name phone

const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('give password, contact name and phone number as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]
// console.log(password, name, phone)

const url =
  `mongodb+srv://fullstack:${password}@cluster0-khtyl.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const entry = new Contact({
  name: name,
  phone: phone,
})

if (process.argv.length === 3) {
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry.name, entry.phone)
    })
    mongoose.connection.close()
  })
  return
}

entry.save().then(response => {
  console.log(`added ${name} number ${phone} to phonebook`)
  mongoose.connection.close()
})