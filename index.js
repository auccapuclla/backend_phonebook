const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3001
app.listen( PORT, () => {
    console.log(`server running on port ${PORT}`)
})

app.use(express.json())
app.use(cors())
morgan.token('post', function (request){
	if(request.method === 'POST')
		return JSON.stringify(request.body)
	else
		return ''
})
morgan.format('postFormat',':method :url :status :res[content-length] - :response-time ms :post')
app.use(morgan('postFormat'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    const len = persons.length
    const date = new Date()
    response.end(`<p>There are ${len} persons on the phonebook</p> <p> ${date} </p>`)
    // response.end(JSON.stringify(`Phonebook has info for ${len} people \n ${date}` ))
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( person => person.id === id)
    console.log(id)
    if (person) {response.json(person)}
    else {response.status(404).end(JSON.stringify("Couldnt find the person"))}
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( person => person.id === id)
    console.log(id)
    if (person) {
        persons = persons.filter( person => person.id !== id)
        // console.log(persons)
        response.status(204).end()
        }
    else{response.status(404).end(JSON.stringify("This persons was already deleted"))}
})
app.post('/api/persons', (request, response) => {
    const person = request.body
    const id = Math.floor(Math.random()*(10000000))
    person.id = id
    // console.log(person)
    if ( person.name && person.number ){
        if ( persons.find(per => per.name === person.name) ){
            response.json({ error: 'name must be unique'})
            // response.end(`alredy exists`)
        }
        else{
            persons = persons.concat(person) //this method creates a new array
            // console.log(persons)
            response.end(`doesnt exists`)
        }
    }
    else {
        response.json({ error: `it lacks of important properties`})
    }
}) 