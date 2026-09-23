// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// If DATABASE_URL is available (Render/Production), use it directly.
// Otherwise, fall back to individual local environment variables.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Required for Render PostgreSQL cloud connections
        }
      },
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false
      }
    );

module.exports = sequelize;