const { Client, CommandInteraction, Permissions } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: {
        description: "Have more information about the bot."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        interaction.reply({
            embeds: [{
                color: config.colors.default,
                author: { name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` },
                description: `Welcome to InviteFetcher! This menu and its links give you a guide on how to use the app.`,
                fields: [
                    {
                        name: "InviteFetcher",
                        value: `\`/invites\` - Check how many people somebody invited.\n\`/leaderboard\` - Check your server's invite leaderboard.\n\`/userinfo\` - Get invite information about somebody.\n\`/bonus\` - Add bonus invitations to a user.\n\`/about\` - Have more information about the bot.`
                    },
                    {
                        name: "Configuration",
                        value: `\`/config\` - View configuration.\n\`/configjoin\` - Configure the welcome system.\n\`/configleave\` - Configure the leave system.`
                    }
                ]
            }],
            components: [{
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        style: "LINK",
                        label: "Dashboard",
                        url: `${config.app.host}:${config.app.port}`
                    },
                    {
                        type: "BUTTON",
                        style: "LINK",
                        label: "Support",
                        url: config.inviteSupport
                    }
                ]
            }]
        }).catch(() => { });
    }
};