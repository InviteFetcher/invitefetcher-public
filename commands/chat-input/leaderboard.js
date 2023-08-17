const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
  data: {
    description: "View leaderboard."
  },
  onlyOwners: false,
  inDev: false,
  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  async exe(client, interaction) {
    try {
      const guildId = interaction.guild.id;

      const leaderboard = await GuildMember.find({ guildID: guildId })
        .sort({ invites: -1 })
        .limit(10);

      const embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setColor(config.colors.default);

      leaderboard.forEach((member, index) => {
        const user = client.users.cache.get(member.id);
        if (user) {
          embed.addField(`\`#${index + 1}\``, `**‎${user.username}** ➡ invites: ${member.invites}`);
        }
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error retrieving leaderboard:", error);
      await interaction.reply("An error occurred while retrieving the leaderboard.");
    }
  }
};