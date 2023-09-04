const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  AttachmentBuilder,
} = require("discord.js");
const Character = require("../../settings/models/Character.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Add a character to your account.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the character.")
        .setMaxLength(12)
        .setMinLength(2)
        .setRequired(true)
    ),
  async execute(interaction) {
    // Defer the reply to the interaction.
    await interaction.deferReply({ ephemeral: true });
    // Get the user id from the interaction.
    const userId = interaction.user.id;
    // Get the name of the character from the interaction.
    const name = interaction.options.getString("name");

    // Check if the character already exists in the database.
    const characterExists = await Character.exists({ name });

    if (characterExists) {
      const embed = new EmbedBuilder()
        .setTitle("Character already exists")
        .setDescription("The character you are trying to add already exists.")
        .setColor("#ff0000");

      return interaction.editReply({ embeds: [embed] });
    }

    if (!characterExists) {
      // Ask the user for the class of the character to choose from select menu.
      const embed = new EmbedBuilder()
        .setTitle("Choose a class")
        .setDescription("Choose the class of the character.")
        .setColor("#00ff00");

      // Create the select menu.
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("character_class")
        .setPlaceholder("Choose a class")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Warrior")
            .setValue("warrior")
            .setEmoji("⚔️"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Mage")
            .setValue("mage")
            .setEmoji("🧙"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Rogue")
            .setValue("rogue")
            .setEmoji("🗡️"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Hunter")
            .setValue("hunter")
            .setEmoji("🏹"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Priest")
            .setValue("priest")
            .setEmoji("📿"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Paladin")
            .setValue("paladin")
            .setEmoji("⚜️"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Warlock")
            .setValue("warlock")
            .setEmoji("🔮"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Druid")
            .setValue("druid")
            .setEmoji("🐻"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Shaman")
            .setValue("shaman")
            .setEmoji("🌊"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Death Knight")
            .setValue("deathknight")
            .setEmoji("❄️")
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      // Send the message with the select menu.
      const message = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      // Create a collector for the select menu.
      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60000,
      });

      // When the user selects an option from the select menu send a message in embed.
      collector.on("collect", async (i) => {
        const characterClass = i.values[0];

        // Create a new character in the database.
        await Character.create({
          owner: userId,
          name: name,
          class: characterClass,
        });

        const attachment = new AttachmentBuilder(
          `./assets/img/classes/wow${characterClass}.png`
        );

        // Create the embed.
        const embed = new EmbedBuilder()
          .setTitle("Character added")
          .setThumbnail(`attachment://wow${characterClass}.png`)
          .setDescription(
            `The character - ${name} - has been added to your account!`
          )
          .setColor("#00ff00");

        // Edit the interaction with the embed.
        await interaction.editReply({
          embeds: [embed],
          components: [],
          files: [attachment],
        });
      });
    }
  },
};
