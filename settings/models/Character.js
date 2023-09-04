const moongose = require("mongoose");

// Create a schema for the character
const characterSchema = moongose.Schema({
  owner: String,
  name: String,
  class: String,
});

module.exports = moongose.model("Character", characterSchema);
