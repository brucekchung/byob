
exports.seed = (knex, Promise) => {
  return knex('people_strengths').del()
    .then(() => knex('strengths').del())
    .then(() => knex('people').del())
    .then(() => {
      return knex('people').insert([
        {id: 1, name: 'Bender'},
        {id: 2, name: 'Bruce'},
      ])
    })
    .then(() => {
      return knex('strengths').insert([
        {id: 1, name: 'Bender'},
        {id: 2, name: 'Bruce'},
      ])
    })
}
