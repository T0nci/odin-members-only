const db = require("./pool");

class Messages {
  async getAllMessages() {
    const { rows } = await db.query("SELECT * FROM messages");
    return rows;
  }
}
class Users {
  async createUser(username, password, firstName, lastName) {
    await db.query(
      "INSERT INTO users (username, password, first_name, last_name, role) VALUES($1, $2, $3, $4, 'none')",
      [username, password, firstName, lastName],
    );
  }

  async getUserByUsername(username) {
    const { rows } = await db.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username],
    );

    return rows[0];
  }
}

module.exports = {
  Messages: new Messages(),
  Users: new Users(),
};
