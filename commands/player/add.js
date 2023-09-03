const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Player = require("../../settings/models/Player.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a character to your collection.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the character.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const characterName = interaction.options.getString("name");

    await interaction.deferReply({ ephemeral: true });

    // Check if the player has ID in the database.
    const playerExists = await Player.exists({ _id: interaction.user.id });

    // If the player doesn't exist, create a new player.
    if (!playerExists) {
      const newPlayer = new Player({
        _id: interaction.user.id,
        characters: [{ name: characterName }],
      });

      await newPlayer.save();

      // Send message to the user using Embed.
      if (newPlayer) {
        const embed = new EmbedBuilder()
          .setTitle("Character Added")
          .setDescription(`You have added ${characterName} to your collection.`)
          .setColor("#00ff00")
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }
    } else {
      // Check if the character already exists
      const player = await Player.findOne({
        _id: interaction.user.id,
        characters: { name: characterName },
      });

      // Send message to the user.
      if (player) {
        const embed = new EmbedBuilder()
          .setTitle("Character Exists")
          .setDescription(
            `You already have ${characterName} in your collection.`
          )
          .setColor("#ff0000")
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }

      // Add the character to the player's collection.
      const newChar = await Player.updateOne(
        { _id: interaction.user.id },
        { $push: { characters: { name: characterName } } }
      );

      // Send message to the user using Embed.
      if (newChar) {
        const embed = new EmbedBuilder()
          .setTitle("Character Added")
          .setDescription(`You have added ${characterName} to your collection.`)
          .setColor("#00ff00")
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }
    }
  },
};
