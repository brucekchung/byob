const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

app.set('port', process.env.NODE_ENV || 3000)
app.use(bodyParser.json())

app.get('/api/v1/strengths', (request, response) => {
  database('strengths').select()
  .then((strengths) => {
    response.status(200).json(strengths)
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.get('/api/v1/strengths/:id', (request, response) => {
  database('strengths').where('id', request.params.id)
  .select()
  .then((strengths) => {
    response.status(200).json(strengths)
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.get('/api/v1/people', (request, response) => {
  database('people').select()
  .then((people) => {
    response.status(200).json(people)
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.get('/api/v1/people/:id', (request, response) => {
  database('people').where('id', request.params.id)
  .select()
  .then((people) => {
    response.status(200).json(people)
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.post('/api/v1/people/:people_id/strengths/:id', (request, response) => {
  const { name } = request.body

  if (!name) {
    return response
      .status(422)
      .send({ error: `Expected format: { name: <String> }. You're missing a name.`})
  }

  database('people').insert({name}, 'id')
  .then(people => {
    response.status(201).json({ id: request.body[0], name })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.post('/api/v1/people/:id', (request, response) => {
  const { strength } = request.body

  if (!strength) {
    return response
      .status(422)
      .send({ error: `Expected format: { strength: <String> }. You're missing a strength.`})
  }

  database('people').insert({strength}, 'id')
  .then(people => {
    response.status(201).json({ id: request.body[0], name, strength })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})


app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})

module.exports = app