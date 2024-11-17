module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'test123',
        database: process.env.DB_NAME || 'library_management'
      },
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeders'
      }
    },
    production: {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST || 'mysql',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'test123',
        database: process.env.DB_NAME || 'library_management'
      },
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeders'
      }
    }
  };