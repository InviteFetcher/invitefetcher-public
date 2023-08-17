const { Client, UserContextMenuInteraction } = require("discord.js");
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
    data: {},
    onlyOwners: true,
    inDev: true,
    /**
     * 
     * @param {Client} client 
     * @param {UserContextMenuInteraction} interaction 
     */
    async exe(client, interaction) {
        //const { targetUser } = interaction;
        //const dbInvites = await GuildMember.findOne({ id: targetUser.user.id, guildID: targetUser.guild.id });
        interaction.reply({
            embeds: [{
                color: config.colors.default,
                //description: `You have **${dbInvites.invites}** invites! (**${dbInvites.bonus}** bonus, **${dbInvites.leaves}** leaves, **${dbInvites.fake}** fake)`
                description: `You have **none** invites! (**none** bonus, **none** leaves, **none** fake)`
            }],
            ephemeral: false
        }).catch(() => { });
    }
};