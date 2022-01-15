
var morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', function(req , res ){
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello Phonebook<h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const bookLength = persons.length
    response.send(`The phonebook has info for ${bookLength} people <br>${new Date()}</br>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }   
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.number || !person.name) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }
    const ids = persons.map(person => person.id)
    const maxId = Math.max(...ids)
    const newPerson = {
        id: maxId + 1,
        name: person.name,
        number: person.number
    }

    if (persons.some(person => person.name === newPerson.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }else{
        persons = [...persons, newPerson]
        response.status(201).json(newPerson)
    }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
