const db = require("./pool");

const getAllMessages = async () => {
  const { rows } = await db.query("SELECT * FROM messages");

  return rows;
};

module.exports = {
  getAllMessages,
};
