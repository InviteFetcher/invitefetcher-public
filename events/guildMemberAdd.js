const { Client, WebhookClient, Permissions } = require("discord.js");
const Guild = require("../models/Guild");
const GuildMember = require("../models/GuildMember");
const moment = require("moment");
const config = require("../config");

/**
 * 
 * @param {Client} client 
 * @param {GuildMember} member 
 */
module.exports = async (client, member) => {
    const { guild, id } = member;

    const botMember = await guild.members.fetch(client.user.id);
    if (!botMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        console.log("Bot does not have MANAGE_GUILD permission. Ignoring invite processing.");
        return;
    }

    const fetchedInvites = await guild.invites.fetch();
    const usedInvite = fetchedInvites.find((invite) => invite.uses > 0 && invite.inviter);

    if (usedInvite) {
        const guildMember = new GuildMember({
            id: id,
            guildID: guild.id,
            invitedBy: usedInvite.inviter.id,
            usedInvite: {
                code: usedInvite.code,
                uses: usedInvite.uses
            }
        });

        await guildMember.save();

        const inviter = await GuildMember.findOne({ id: usedInvite.inviter.id, guildID: guild.id });
        if (inviter) {
            inviter.invites += 1;
            await inviter.save();
        } else {
            const newInviter = new GuildMember({
                id: usedInvite.inviter.id,
                guildID: guild.id,
                invites: 1
            });
            await newInviter.save();
        }
    }

    // Event join user send
    const guildData = await Guild.findOne({ id: member.guild.id });
    if (!guildData || !guildData.joinChannel) return;

    const joinChannel = member.guild.channels.cache.get(guildData.joinChannel);
    if (!joinChannel || !joinChannel.isText()) return;

    let replacedMessage = "";
    if (usedInvite && usedInvite.inviter) {
        const inviter = await GuildMember.findOne({ id: usedInvite.inviter.id, guildID: guild.id });
        const inviterInvites = inviter ? inviter.invites : 0;
        replacedMessage = guildData.joinMessage
            ? guildData.joinMessage
                .replace(/{user}/g, member.toString())
                .replace(/{user.name}/g, member.user.username)
                .replace(/{user.tag}/g, member.user.tag)
                .replace(/{user.invited}/g, usedInvite.inviter.toString())
                .replace(/{user.invited.username}/g, usedInvite.inviter.username)
                .replace(/{user.invited.tag}/g, usedInvite.inviter.tag)
                .replace(/{user.invited.invites}/g, inviterInvites.toString())
                .replace(/{guild}/g, member.guild.name)
                .replace(/{guild.count}/g, member.guild.memberCount)
            : `Welcome ${member.toString()} joined with the server's personalized invite.`;
    } else {
        replacedMessage = guildData.joinMessage
            ? guildData.joinMessage
                .replace(/{user}/g, member.toString())
                .replace(/{user.name}/g, member.user.username)
                .replace(/{user.tag}/g, member.user.tag)
                .replace(/{guild}/g, member.guild.name)
                .replace(/{guild.count}/g, member.guild.memberCount)
            : `Welcome ${member.toString()}, you are on the ${member.guild.name} server!`;
    }

    joinChannel.send(replacedMessage);
};