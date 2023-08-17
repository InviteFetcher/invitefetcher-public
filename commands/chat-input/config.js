const { Client, CommandInteraction, MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");
const Guild = require("../../models/Guild");
const config = require("../../config");

module.exports = {
    data: {
        description: "Look at the server configuration."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        const dbGuild = await Guild.findOne({ id: interaction.guild.id });

        const resetButton = new MessageButton()
            .setCustomId("reset_menu")
            .setStyle("DANGER")
            .setDisabled(true)
            .setLabel("Reset Menu");

        const dashboardButton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Visit Dashboard")
            .setURL(`${config.app.host}:${config.app.port}/dashboard/server/${interaction.guild.id}`);

        const buttonRow = new MessageActionRow().addComponents(resetButton, dashboardButton);

        const embed = new MessageEmbed()
            .setColor(config.colors.default)
            .setTitle(`Configure ${interaction.guild.name}`)
            .addFields(
                { name: 'Welcome', value: `Channel: <#${dbGuild.joinChannel}>\nMessage: ${dbGuild.joinMessage}` },
                { name: 'Leave', value: `Channel: <#${dbGuild.leaveChannel}>\nMessage: ${dbGuild.leaveMessage}` },
                { name: 'Erase data', value: 'Click the `Reset Menu` button to erase data e.g reset invite counts.' }
            );

        interaction.reply({
            embeds: [embed],
            components: [buttonRow],
            ephemeral: false
        }).catch(() => { });
    }
};