const { Client } = require("pg");
const { argv } = require("node:process");

if (!argv[2]) throw new Error("Please provide a connectionString.");

const tableSQL = `
CREATE TYPE role AS ENUM ('none', 'member', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  first_name VARCHAR ( 255 ),
  last_name VARCHAR ( 255 ),
  role role
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  text VARCHAR ( 255 ),
  date TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);
`;
async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: argv[2],
  });
  await client.connect();

  await client.query(tableSQL);

  await client.end();
  console.log("done.");
}

main();
