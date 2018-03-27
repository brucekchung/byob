module.exports = {
  development: {
    client: 'pg',
    connection: 'postgress://localhost/byob',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}
