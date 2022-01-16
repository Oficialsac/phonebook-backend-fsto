require('dotenv').config()
require('./mongo')
var morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const persons = require('./models/persons')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :body'))


app.get('/api/persons', (request, response) => {
    persons.find({})
        .then(res => {
            response.json(res)
        })
})

app.get('/api/persons/:id', (request, response, next) => {

    const { id } = request.params
    persons.findById(id)
        .then(res => {
            response.json(res)
        }).catch(error => {
            next(error)
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    persons.findByIdAndRemove(id)
        .then(res => {
            response.status(204).end()
        }).catch(error => {
            console.error(error.name);
            next(error)
        })
})

app.post('/api/persons', (request, response , next) => {
    const person = request.body

    // if (!person.number || !person.name) {
    //     return response.status(400).json({
    //         error: 'Name or number is missing'
    //     })
    // }

    const newPerson = new persons({
        name: person.name,
        number: person.number
    })


    newPerson.save()
        .then(res => {
            response.status(201).json(res)
        }).catch( error  => {
            console.error("ADAWDAWD", error);
            next(error)
        })

})

app.put('/api/persons/:id', (request, response , next) => {
    const { id } = request.params
    const person = request.body

    console.log(id);
    const newPersonInfo = {
        name: person.name,
        number: person.number
    }

    persons.findByIdAndUpdate( id , newPersonInfo, {new : true})
        .then( result => {
            response.json(result)
        }).catch( error => {
            console.error(error.name);
            next(error)
        })
  
})

app.use((error, request, response, next) => {
    const { name } = request.body
    console.error("eroor",error.name)   
    if (error.name === 'CastError') {
        return response.status(400).send( {error: 'id is malformated , please check this and recharge'})
    } else if( error.name === 'ValidationError'){
        return response.status(400).send( 
            {error: `"Note validation failed:" content: Path ('${name}') is shorter than the minimun allowed length (5) `})
    }
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
