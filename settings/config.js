const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  MONGO_URI: process.env.MONGO_URI,
};
