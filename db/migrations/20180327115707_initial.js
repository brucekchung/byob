exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('strengths', function(table) {
      table.increments('id').primary()
      table.string('strengthsTitle')
      table.string('description')     

      table.timestamps(true, true)
    }),

    knex.schema.createTable('people_strengths', function(table) {
        table.increments('id').primary()
        table.integer('people_id').references('people.id')
        table.integer('strengths_id').references('strengths.id')
    }),

    knex.schema.createTable('people', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
    })
  ])
}

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('strengths'),
    knex.schema.dropTable('people_strengths'),
    knex.schema.dropTable('people')
  ])
}


  

  
