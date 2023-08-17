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
    const guildData = new GuildModel({
      id: guild.id
    });

    await guildData.save();

    guild.members.cache.each(async (member) => {
      const guildMember = new GuildMemberModel({
        id: member.id,
        guildID: guild.id
      });
      await guildMember.save();
    });

    console.log(`Joined guild: ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error('Error while saving guild data:', error);
  }
};