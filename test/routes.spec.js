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
  })

  describe('GET /api/v1/people', () => {
    it('should have a GET route for people', () => {
      return chai.request(server)
      .get('/api/v1/people')
      .then(response => {
        console.log(response.body)
        response.should.have.status(200)
        response.should.be.json

        response.body.length.should.equal(3)
      })
      .catch(error => {
        throw error
      })
    })
    

  it('should have a GET route for people by id', () => {
    return chai.request(server)
    .get('/api/v1/people/2')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;

        response.body[0].should.have.property('id');
        response.body[0].id.should.be.a('number');

        response.body[0].should.have.property('peopleTitle');
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
  })
})