var express = require('express')
var app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('body',
function (req, res) { 
  return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {   
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
        
      },
      { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
      },
      { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
      },
      { 
        id: 4,  
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
      }
]
let date = new Date();
let howMany = persons.length;

const generateId = () => {
  const randomId = Math.floor(Math.random() * 9999999999)
  return randomId
  /*const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1*/
}



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {  
  morgan.token('type', function (req, res) { return req.headers['content-type'] })
    response.json(persons)
  })

app.get('/info', (request, response) => {
    response.send('Phonebook has info for '+howMany+' people</br>'+date)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(persons => persons.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    
    const body = request.body
    const nameAlreadyfound =persons.find(persons => persons.name === body.name)
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    if (nameAlreadyfound) {
      return response.status(400).json({ 
        error: 'name already in phonebook' 
      })
    }

    const personAdd = {
      id: generateId(),
      name: body.name,
      number: body.number
    }

    persons = persons.concat(personAdd)

    response.json(personAdd)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
