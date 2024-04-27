const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())//For problem 3.5 before using the middleware function

app.use(cors())

// To use the middleware morgan....this id for Problem 3.7
app.use(morgan('tiny'))

// Problem 3.8
// Define a custom token to log the body of the POST request
morgan.token('body', (req, res) => JSON.stringify(req.body));

// Use morgan with a custom format string to include the body size of the POST request
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


//Phone book data
let phoneBook=  [
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

app.get('/', (req, res) => {
    res.send('<h1>Part 3 Exercise</h1>')
})

//Problem 3.1
//Get the json data
app.get('/api/persons', (req, res) => {
    res.json(phoneBook)
})

//Problem 3.2
//Display date and the number of visitors

let visitors = 0

//Date display
const d = new Date()

const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'short'
}
const formattedDate = d.toLocaleString('en-US', options)

app.get('/info', (req, res) => {
 visitors += 1
 res.send(`<div style="font-size: 20px", font-weight: bolder>
               <p>Phonebook has info for ${visitors} people</p>
               <p>${formattedDate} (Eastern European Standard Time)</p>
           </div>`)
})

//Problem 3.3

app.get('/api/persons/:id',(req, res) => {
  const id = +req.params.id
  const findPhoneNumber = phoneBook.find(v => v.id === id)
  
  if(findPhoneNumber)  res.json(findPhoneNumber)
  else res.status(404).end()
  
})


//Problem 3.4 Delete a reource

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  phoneBook = phoneBook.filter(v => v.id !== id)
  //console.log(id, phoneBook)
  res.status(204).end()

})

//Problem 3.5 Recieve a data / Problem 3.6 for handling errors

 //Function to create an ID
 function generateId() {
  const maxId = phoneBook.length > 0 ? Math.max(...phoneBook.map(v => v.id)) : 0

  return Math.floor(Math.random() * 1000) + maxId
}


app.post('/api/persons', (req, res) => {
  handlePersonRequest(req, res);
});

app.put('/api/persons/:id', (req, res) => {
  handlePersonRequest(req, res);
});

function handlePersonRequest(req, res) {
  const body = req.body;
  let filterSameName = phoneBook.find(v => v.name === body.name);
  console.log(filterSameName, filterSameName !== undefined);

  // Error handling, when name or number is missing
  if (!body.name || !body.number) {
      return res.status(400).json({
          error: 'content missing'
      });
  }

  // Check if the person already exists in the phone book
  const existingPerson = phoneBook.find(person => person.name === body.name);

  if (existingPerson) {
      // Update the existing person's number
      existingPerson.number = body.number;

      // Send response indicating the person was updated
      return res.json(existingPerson);
  }

  // If person doesn't exist, create a new entry
  const newPhoneBook = {
      id: generateId(),
      name: body.name,
      number: body.number
  };

  phoneBook.push(newPhoneBook);

  // Send response with the updated phone book
  res.json(phoneBook);
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>  { 
    console.log('The PORT is running at 3001')
    console.log(PORT)
})