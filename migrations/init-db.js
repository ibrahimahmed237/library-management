// scripts/init-db.js
const mysql = require('mysql2/promise');
const config = require('../knexfile');

async function waitForDatabase(config, maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password
      });
      
      console.log('Successfully connected to MySQL server');
      await connection.end();
      return true;
    } catch (error) {
      console.log(`Attempt ${attempt}/${maxAttempts}: MySQL not ready yet...`);
      // Wait for 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Could not connect to MySQL server');
}

async function createDatabase() {
  const environment = process.env.NODE_ENV || 'development';
  const { host, user, password, database } = config[environment].connection;
  
  try {
    // Wait for MySQL to be ready
    await waitForDatabase({ host, user, password });

    // Create connection without database
    const connection = await mysql.createConnection({
      host,
      user,
      password
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    console.log(`Database ${database} created or verified`);
    
    // Switch to the database
    await connection.query(`USE ${database}`);
    console.log(`Now using database ${database}`);

    await connection.end();
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Execute if this script is run directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

exports.up = async () => await createDatabase();

exports.down = async () => await mysql.createConnection({ host: 'localhost', user: 'root', password: 'root' }).query('DROP DATABASE IF EXISTS test');