process.env.NODE_ENV = 'test';

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
    
  it('should have a GET route for strengths by id', () => {
    return chai.request(server)
    .get('/api/v1/strengths/2')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.have.property('id');
        response.body[0].id.should.be.a('number');

        response.body[0].should.have.property('strengthsTitle');
        response.body[0].strengthsTitle.should.equal('Context');

        response.body[0].should.have.property('description');
        response.body[0].description.should.equal('People who are especially talented in the Context theme enjoy thinking about the past. They understand the present by researching its history.');

        response.body[0].should.have.property('created_at');
        response.body[0].created_at.should.be.a('string');
        
        response.body[0].should.have.property('updated_at');
        response.body[0].updated_at.should.be.a('string');
      })
      .catch(error => {
        throw error;
      })
    })

  it('should NOT GET route for strength with invalid id', () => {
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

  it('should NOT GET route for people with invalid id', () => {
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
    it.skip('Should add a new person', () => {
      return chai.request(server)
      .post('/api/v1/people')
      .send({
        name: 'robbie',
        email: 'robbie@turing.io',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM'
      })
      .then(response => {
        console.log(response.body)
        response.should.have.status(201)
        response.should.be.json
        response.body.should.be.a('object')

        response.body.should.have.property('id')
        response.body.id.should.be.a('number')
        response.body.id.should.equal(2)        
        
        response.body.should.have.property('name')
        response.body.name.should.equal('robbie')

        response.body.should.have.property('email')
        response.body.title.should.equal('robbie@turing.io')

        response.body.should.have.property('token')
        response.body.title.should.equal('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7Im5hbWUiOiJyb2JiaWUiLCJlbWFpbCI6InJvYmJpZUB0dXJpbmcuaW8ifSwiaWF0IjoxNTIyMzU4NzQxfQ.PQ9hRIuHopHZitAxhTnLI0D3TINUlwDoc3HjdDufcqM')
      })
      .catch(error => {
        throw error
      })
    })
  })
})
