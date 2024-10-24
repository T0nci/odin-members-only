const CustomError = require("../utils/CustomError");
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
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    return rows[0];
  }

  async getUserById(id) {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    return rows[0];
  }

  async setRole(id, roleNum) {
    let role = null;
    if (roleNum === 1) role = "member";
    else if (roleNum === 2) role = "admin";
    else throw new CustomError(404, "Role Not Found.");

    await db.query("UPDATE users SET role = $1 WHERE id = $2", [role, id]);
  }
}

module.exports = {
  Messages: new Messages(),
  Users: new Users(),
};
