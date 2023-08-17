const { Client, CommandInteraction, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: {
        description: "test"
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        const embed = new MessageEmbed()
            .setColor(config.colors.default)
            .setDescription("test");

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        }).catch(() => { });
    }
};