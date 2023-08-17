const { Client, CommandInteraction, Permissions } = require("discord.js");
const config = require("../../config");
const Guild = require("../../models/Guild");

module.exports = {
    data: {
        description: "Allows you to see the bot's information."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        /*const guildData = await Guild.findOne({ id: interaction.guildId });
        if (!guildData || !guildData.premium) {
            interaction.reply({
                content: "Sorry, this feature is only for premium servers.",
                ephemeral: true
            });
            return;
        }*/

        interaction.reply({
            embeds: [{
                color: config.colors.default,
                author: { name: `About ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` },
                fields: [
                    {
                        name: "Team",
                        value: `<@1056780751133224990> | koyaim#6290\n<@793482512416112641> | Andraz#0001`
                    },
                    {
                        name: "Discord.js",
                        value: `\`v13.16.0\``
                    },
                    {
                        name: "Node.js",
                        value: `\`v16\``
                    },
                    {
                        name: "Servers",
                        value: `\`${client.guilds.cache.size}\``
                    },
                    {
                        name: "Users",
                        value: `\`${client.users.cache.size}\``
                    },
                    {
                        name: "Ping",
                        value: `\`null\``
                    },
                    {
                        name: "Support",
                        value: `[Click here](${config.inviteSupport})`
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