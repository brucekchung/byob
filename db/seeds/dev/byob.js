const strengthData = require('../../../strength-themes-data.js')

exports.seed = (knex, Promise) => {
  return knex('people_strengths').del()
    .then(() => knex('strengths').del())
    .then(() => knex('people').del())
    .then(() => { 
      return knex('strengths').insert(strengthData)
    })
}
