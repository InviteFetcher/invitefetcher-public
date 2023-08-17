const { Client } = require("discord.js");
const GuildMember = require("../models/GuildMember");
const Guild = require("../models/Guild");
const moment = require("moment");

/**
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  const { guild, id } = member;

  const guildMember = await GuildMember.findOne({ id: id, guildID: guild.id });
  if (guildMember) {
    await guildMember.remove();

    const inviter = await GuildMember.findOne({ id: guildMember.invitedBy, guildID: guild.id });
    if (inviter) {
      inviter.leaves += 1;
      await inviter.save();
    }
  }

  //Event leave message guild
  const guildData = await Guild.findOne({ id: member.guild.id });
  if (!guildData || !guildData.leaveChannel) return;

  const leaveChannel = member.guild.channels.cache.get(guildData.leaveChannel);
  if (!leaveChannel || !leaveChannel.isText()) return;

  const leaveMessage = guildData.leaveMessage || "Goodbye {user}!";

  const replacedMessage = leaveMessage
    .replace(/{user}/g, member.toString())
    .replace(/{user.name}/g, member.user.username)
    .replace(/{user.tag}/g, member.user.tag)
    .replace(/{user.invited}/g, guildMember && guildMember.invitedBy ? `<@${guildMember.invitedBy}>` : "Unknown Inviter")
    .replace(/{guild}/g, member.guild.name)
    .replace(/{guild.count}/g, member.guild.memberCount);

  leaveChannel.send(replacedMessage);
};