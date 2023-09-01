const moongoose = require("mongoose");
const { MONGO_URI } = require("../settings/config.js");

module.exports = async () => {
  try {
    await moongoose.connect(MONGO_URI);
    console.log("Connected to the database.");
  } catch (err) {
    console.log(err);
  }
};
