module.exports = {
  development: {
    client: 'pg',
    connection: 'postgress://localhost/strengths',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}









