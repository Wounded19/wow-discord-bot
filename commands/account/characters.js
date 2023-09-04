const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Character = require("../../settings/models/Character.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("characters")
    .setDescription("Get a list of your characters"),
  async execute(interaction) {
    const characters = await Character.find({ owner: interaction.user.id });

    if (characters.length === 0) {
      return interaction.reply(
        "You don't have any characters yet. Use /character to create one."
      );
    }

    const characterNames = characters.map((character) => character.name);

    const embed = new EmbedBuilder()
      .setTitle("Your characters")
      .setDescription("Here is a list of your characters:")
      .addFields({
        name: "Characters",
        value: characterNames.join("\n"),
      })
      .setColor("#00ff00");

    return interaction.reply({ embeds: [embed] });
  },
};
