process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const server = require('../server')

const environment = 'test'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)

chai.use(chaiHttp)

describe('API Routes', () => {

  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/strengths', () => {
    it('should have a GET route for strengths', () => {
      return chai.request(server)
      .get('/api/v1/strengths')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json

        response.body.length.should.equal(34)
      })
      .catch(error => {
        throw error
      })
    })

    it('GET route for strengths should have optional query param complement', () => {
      return chai.request(server)
      .get('/api/v1/strengths?complement=Woo')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json

        response.body.length.should.equal(28)
      })
      .catch(error => {
        throw error
      })
    })
    
  it('should have a GET route for strengths by id', () => {
    return chai.request(server)
    .get('/api/v1/strengths/2')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json
        response.body[0].should.have.property('id')
        response.body[0].id.should.be.a('number')

        response.body[0].should.have.property('strengthsTitle')
        response.body[0].strengthsTitle.should.equal('Context')

        response.body[0].should.have.property('description')
        response.body[0].description.should.equal('People who are especially talented in the Context theme enjoy thinking about the past. They understand the present by researching its history.')

        response.body[0].should.have.property('created_at')
        response.body[0].created_at.should.be.a('string')
        
        response.body[0].should.have.property('updated_at')
        response.body[0].updated_at.should.be.a('string')
      })
      .catch(error => {
        throw error
      })
    })

  it('should NOT GET route for STRENGTH with INVALID ID', () => {
    return chai.request(server)
    .get('/api/v1/strengths/2788347589')
      .then(response => {
        response.should.have.status(500)
        response.should.be.json
        response.body.should.equal('Invalid Strength ID: error: select * from "strengths" where "id" = $1 - value "2788347589" is out of range for type integer')
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('GET /api/v1/people', () => {
    it('should have a GET route for people', () => {
      return chai.request(server)
      .get('/api/v1/people')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json

        response.body.length.should.equal(1)
      })
      .catch(error => {
        throw error
      })
    })
    
  it('should have a GET route for people by id', () => {
    return chai.request(server)
    .get('/api/v1/people/1')
      .then(response => {
        response.should.have.status(200)
        response.should.be.json

        response.body[0].should.have.property('id')
        response.body[0].id.should.be.a('number')
        response.body[0].id.should.equal(1)        

        response.body[0].should.have.property('name')
        response.body[0].name.should.equal('Bruce')
      })
      .catch(error => {
        throw error
      })
    })

  it('should NOT GET route for PEOPLE with INVALID ID', () => {
    return chai.request(server)
    .get('/api/v1/people/2234324242342342')
      .then(response => {
        response.should.have.status(500)
        response.should.be.json
        response.body.should.equal('Invalid People ID: error: select * from "people" where "id" = $1 - value "2234324242342342" is out of range for type integer')
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('POST /api/v1/people', () => {
    it('Should add a new person', () => {
      return chai.request(server)
      .post('/api/v1/people')
      .send({
        name: 'robbie',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(201)
        response.should.be.json
        response.body.should.be.a('object')

        response.body.should.have.property('id')
        response.body.id.should.be.a('number')
        response.body.id.should.equal(2)        
        
        response.body.should.have.property('name')
        response.body.name.should.equal('robbie')
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT add a new person if NAME MISSING', () => {
      return chai.request(server)
      .post('/api/v1/people')
      .send({
        // name: 'robbie',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(422)
        response.should.be.json
        response.body.should.equal('Name Missing!')
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('POST /api/v1/people/:people_id/strengths', () => {
    it('Should add a new strength to person', () => {
      return chai.request(server)
      .post('/api/v1/people/1/strengths')
      .send({
        strength: 'Arranger',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(201)
        response.should.be.json
        response.body.should.be.a('object')

        response.body.should.have.property('id')
        response.body.id.should.be.a('number')
        response.body.id.should.equal(1)        
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT add a new person with missing strength', () => {
      return chai.request(server)
      .post('/api/v1/people/1/strengths/')
      .send({
        // strength: 'Futuristic',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(422)
        response.should.be.json
        response.body.should.equal('Strength ID Missing!')        
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('DELETE /api/v1/people/:id', () => {
    it('Should delete a people by id', () => {
      return chai.request(server)
      .delete('/api/v1/people/1')
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(202)
        response.text.should.equal('Deleted')
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT delete a people if id doesn\'t exist', () => {
      return chai.request(server)
      .delete('/api/v1/people/1asdasds324234234')
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(500)
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('DELETE /api/v1/strengths/:id', () => {
    it('Should delete a strengths by id', () => {
      return chai.request(server)
      .delete('/api/v1/strengths/1')
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(202)
        response.text.should.equal('Deleted')
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT delete a strengths if id doesn\'t exist', () => {
      return chai.request(server)
      .delete('/api/v1/strengths/thisaintright')
      .send({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(500)
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('PATCH /api/v1/people/:id', () => {
    it('Should patch people by id', () => {
      return chai.request(server)
      .patch('/api/v1/people/1')
      .send({
        name: 'Gerald',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(202)
        response.text.should.equal('Edited')
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT patch people with INVALID ID', () => {
      return chai.request(server)
      .patch('/api/v1/people/234')
      .send({
        name: 'robbie',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(404)
        response.text.should.equal('Failed to Edit')
      })
      .catch(error => {
        throw error
      })
    })
  })

  describe('PATCH /api/v1/strengths/:id', () => {
    it('Should patch strengths by id', () => {
      return chai.request(server)
      .patch('/api/v1/strengths/1')
      .send({
        strengthsTitle: 'Woo',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(202)
        response.text.should.equal('Edited')
      })
      .catch(error => {
        throw error
      })
    })

    it('Should NOT patch strengths with INVALID ID', () => {
      return chai.request(server)
      .patch('/api/v1/strengths/234')
      .send({
        strengthsTitle: 'Woo',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        response.should.have.status(404)
        response.text.should.equal('Failed to Edit')
      })
      .catch(error => {
        throw error
      })
    })
  })
})
