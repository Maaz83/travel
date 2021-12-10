const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const pool = new Pool({
  user: "maaz",
  host: "localhost",
  database: "travel",
  password: "password",
  port: 5432,
});

async function find_user(email, callback) {
  pool.query(
    `
      SELECT * FROM users
      WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      callback(results.rows[0]);
    }
  );
}
async function insert_user(
  username,
  email,
  hashedPassword,
  phonenumber,
  callback
) {
  await pool.query(
    `INSERT INTO users (username, email, password,phonenumber)
                VALUES ($1, $2, $3, $4)
                RETURNING id, password`,
    [username, email, hashedPassword, phonenumber],
    (err, results) => {
      if (err) {
        throw err;
      }
      callback(results.rows[0]);
    }
  );
}
module.exports = {
  find_user,
  insert_user,
};
