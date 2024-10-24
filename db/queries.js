const db = require("./pool");

module.exports = class Messages {
  #query;
  constructor() {
    this.#query = db.query;
  }

  async getAllMessages() {
    const { rows } = await this.#query("SELECT * FROM messages");
    return rows;
  }
};

module.exports = class Users {
  #query;
  constructor() {
    this.#query = db.query;
  }

  async getUserById(id) {
    const { rows } = await this.#query(
      "SELECT id, username, password FROM users WHERE id = $1",
      [id],
    );
    return rows[0];
  }
};
