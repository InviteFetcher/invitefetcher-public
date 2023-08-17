const { Client, Guild } = require("discord.js");
const GuildModel = require('../models/Guild');
const GuildMemberModel = require('../models/GuildMember');
const config = require("../config");

/**
 * 
 * @param {Client} client 
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
  try {
    await GuildModel.findOneAndDelete({ id: guild.id });

    await GuildMemberModel.deleteMany({ guildID: guild.id });

    console.log(`Left guild: ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error('Error while deleting guild data:', error);
  }
};