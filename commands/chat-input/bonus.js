const { Client, CommandInteraction } = require("discord.js");
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
  data: {
    name: "bonus",
    description: "Add invitation bonuses to a user.",
    options: [
      {
        type: "USER",
        name: "user",
        description: "The member you are going to add bonus.",
        required: true
      },
      {
        type: "INTEGER",
        name: "amount",
        description: "How many bonuses do you want to give?",
        required: true
      }
    ]
  },
  onlyOwners: false,
  inDev: false,
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  async exe(client, interaction) {
    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      return interaction.reply({
        embeds: [{
          color: config.colors.red,
          description: 'You do not have permission to use this command.'
        }],
        ephemeral: true
      });
    }

    const targetMember = interaction.options.getMember('user');
    const amount = interaction.options.getInteger('amount');

    if (!targetMember) {
      return interaction.reply({
        embeds: [{
          color: config.colors.red,
          description: 'Please provide a valid member.'
        }],
        ephemeral: true
      });
    }

    if (!amount || amount <= 0) {
      return interaction.reply({
        embeds: [{
          color: config.colors.red,
          description: 'Please provide a valid positive number for the amount.'
        }],
        ephemeral: true
      });
    }

    const guildMember = await GuildMember.findOne({
      id: targetMember.id,
      guildID: interaction.guild.id
    });

    if (!guildMember) {
      return interaction.reply({
        embeds: [{
          color: config.colors.red,
          description: 'The specified member does not exist in the database.'
        }],
        ephemeral: true
      });
    }

    guildMember.bonus += amount;
    await guildMember.save();

    interaction.reply({
      embeds: [{
        color: config.colors.green,
        description: `${amount} bonus(es) added to ${targetMember.user.tag}.`
      }],
      ephemeral: true
    });
  }
};