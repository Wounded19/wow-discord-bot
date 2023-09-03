const moongose = require("mongoose");

// Create a schema for the character
const characterSchema = moongose.Schema({
  name: String,
  class: String,
});

module.exports = moongose.model("Character", characterSchema);
