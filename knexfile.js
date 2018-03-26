module.exports = {
  development: {
    client: 'pg',
    connection: 'postgress://localhost/name',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}









