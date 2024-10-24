const db = require("./pool");

class Messages {
  #query;
  constructor() {
    this.#query = db.query;
  }

  async getAllMessages() {
    const { rows } = await this.#query("SELECT * FROM messages");
    return rows;
  }
}
class Users {
  #query;
  constructor() {
    this.#query = db.query;
  }

  async createUser(username, password, firstName, lastName) {
    await db.query(
      "INSERT INTO users (username, password, first_name, last_name, role) VALUES($1, $2, $3, $4, 'none')",
      [username, password, firstName, lastName],
    );
  }

  async getUserById(id) {
    const { rows } = await this.#query(
      "SELECT id, username, password FROM users WHERE id = $1",
      [id],
    );
    return rows[0];
  }
}

module.exports = {
  Messages: new Messages(),
  Users: new Users(),
};
