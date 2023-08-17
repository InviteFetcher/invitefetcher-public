const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: {
        description: "Display the dashboard link to configure the bot."
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
            .setDescription(`You can configure me for your server using our dashboard by clicking [here](${config.app.host}:${config.app.port}).`);

        interaction.reply({
            embeds: [embed],
            ephemeral: false
        }).catch(() => { });
    }
};