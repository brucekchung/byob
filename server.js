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

app.post('/api/v1/people/:people_id/strengths/:strengths_id', (request, response) => {
  console.log('body: ', request.body)
  //if (!people_id || !strength_id) {
    //return response
      //.status(422)
      //.send({ error: `You're missing a people_id or strengths_id.`})
  //}
  const { strength_id, people_id } = request.body
  database('people_strengths').insert({strength_id, people_id}, 'id')
  .then(people => {
    response.status(201).json({ id: people[0] })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.post('/api/v1/people/', (request, response) => {
  const { name } = request.body

  if (!name) {
    return response
      .status(422)
      .send({ error: `You're missing an name.`})
  }

  database('people').insert({name}, 'id')
  .then(people => {
    response.status(201).json({ id: request.body[0], name })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})


app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})

module.exports = app
