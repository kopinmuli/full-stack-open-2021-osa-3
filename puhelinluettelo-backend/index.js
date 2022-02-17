require('dotenv').config()
var express = require('express')
var app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body',
function (req, res) { 
  return JSON.stringify(req.body) })

let persons = [];
let date = new Date();
let howMany = persons.length;





app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {  
  Person.find({}).then(persons => {
    response.json(persons)
    howMany=persons.length;
  })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      howMany=persons.length;
      response.send('Phonebook has info for '+howMany+' people</br>'+date)
  })
})

app.get('/api/persons/:id', (request, response, next) => { 
      Person.findById(request.params.id).then(person => {
        if (person) {
          response.json(person)
        } 
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
  
  const body = request.body
   
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
    const personAdd = new Person({
      name: body.name,
      number: body.number
    })
    personAdd.save().then(savedPerson => {
      response.json(savedPerson)
    })
    persons = persons.concat(personAdd)  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
  .then(updatedPerson => {
    console.log(updatedPerson);
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)