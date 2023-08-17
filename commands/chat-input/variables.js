const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: {
        description: "Show the variables you can use in the join, leave a message."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        const dashboardButton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Visit Dashboard")
            .setURL(`${config.app.host}:${config.app.port}/dashboard/server/${interaction.guild.id}`);

        const buttonRow = new MessageActionRow().addComponents(dashboardButton);

        const embed = new MessageEmbed()
            .setColor(config.colors.default)
            .setTitle("Here is the list of variables.")
            .setDescription(`You can configure join and leave messages directly from the new [dashboard](${config.app.host}:${config.app.port}) of InviteManage.`)
            .addFields(
                { name: '{user}', value: 'Mentions the user joining the server.' },
                { name: '{user.name}', value: 'Name of the user joining the server.' },
                { name: '{user.tag}', value: 'Tag of the user joining the server.' },
                { name: '{user.invited}', value: 'Mention the user who invited the user joining the server.' },
                { name: '{user.invited.username}', value: 'Name of the user who invited the user joining the server.' },
                { name: '{user.invited.tag}', value: 'Tag of the user who invited the user joining the server.' },
                { name: '{guild}', value: 'Server name.' },
                { name: '{guild.count}', value: 'Total number of members in the server.' },
            );

        interaction.reply({
            embeds: [embed],
            components: [buttonRow],
            ephemeral: false
        }).catch(() => { });
    }
};