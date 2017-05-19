module.exports = {
  PostgreSQL: {
    'host': process.env.PSQL_DB_HOST ? process.env.PSQL_DB_HOST : '192.168.99.100',
    'port': process.env.PSQL_DB_PORT ? process.env.PSQL_DB_PORT : 5432,
    'url': process.env.PSQL_DB_URL ? process.env.PSQL_DB_URL : 'postgresql://test_user:qwerty@192.168.99.100:5432/test_database',
    'database': 'test_database',
    'password': 'qwerty',
    'name': 'PostgreSQL',
    'user': 'test_user ',
    'connector': 'postgresql'
  }
}
