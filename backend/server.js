const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use('/api/attendees', require('./routes/attendees'))
app.use('/api/venues', require('./routes/venues'))
app.use('/api/events', require('./routes/events'))

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})