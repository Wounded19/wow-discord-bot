const moongose = require("mongoose");

// Create a schema for the player
// Every player has a unique Discord ID and list of owned characters
const playerSchema = moongose.Schema({
  _id: String,
  main: String,
});

module.exports = moongose.model("Player", playerSchema);
