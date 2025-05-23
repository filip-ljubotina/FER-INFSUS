const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "password",
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
    process.exit(1);
  }
  console.log("Connected to PostgreSQL");
});

module.exports = pool;
