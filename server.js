const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const jwt = require('jsonwebtoken')

app.set('port', process.env.PORT || 3000)
app.set('secretKey', 'whatever')
app.use(bodyParser.json())
app.use(express.static('public'))

function checkAuth(req, res, next) {
  const { token } = req.body

  if(!token) {
    return res.status(403).send('Token Invalid')
  }
  try {
    const decoded = jwt.verify(token, app.get('secretKey'))
    const email = decoded.payload.email

    if(email.includes('@turing.io')) {
      next()
    } else {
      return res.status(403).send('Not Authorized')
    }
  } catch (error) {
    return res.status(403).send('Error')
  }
}

app.post('/authenticate', (req, res) => {
  const payload = req.body
  const token = jwt.sign({payload}, app.get('secretKey'))

  return res.status(201).json(token)
})

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
    response.status(500).json(`Invalid Strength ID: ${error}`)
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
    response.status(500).json(`Invalid People ID: ${error}`)
  })
})

app.post('/api/v1/people/:people_id/strengths/', checkAuth, async (request, response) => {
  const { people_id } = request.body
  const strengths_id = await database('strengths').where('strengthsTitle', request.body.strength)

  database('people_strengths').insert({strengths_id: strengths_id[0].id, people_id}, 'id')
  .then(people => {
    response.status(201).json({ id: people[0] })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.post('/api/v1/people/', checkAuth, (request, response) => {
  const { name } = request.body
  
  if (!name) {
    return response
      .status(422)
      .send({ error: `You're missing an name.`})
  }

  database('people').insert({name}, 'id')
  .then(people => {    
    response.status(201).json({ id: people[0], name })
  })
  .catch(error => {
    response.status(500).json({error})
  })
})

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})

app.delete('/api/v1/people/:id', checkAuth, (request, response) => {
  database('people').where('id', request.params.id)
   .select()
   .del()
    .then(people => {
      if(!people.length) {
        response.status(202).send('Deleted')
      } else {
        response.status(404).send('Error Deleting')
      }
    })
    .catch((err) => response.status(500).json({err}))
})

app.delete('/api/v1/strengths/:id', checkAuth, (request, response) => {
  database('people_strengths').where('id', request.params.id)
   .select()
   .del()
    .then(people => {
      if(!people.length) {
        response.status(202).send('Deleted')
      } else {
        response.status(404).send('Error Deleting')
      }
    })
    .catch((err) => response.status(500).json({err}))
})

module.exports = app
