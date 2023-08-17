const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
    data: {
        description: "See his profile."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        const dbGuildMember = await GuildMember.findOne({ id: interaction.user.id, guild: interaction.guild.id });

        const embed = new MessageEmbed()
            .setColor(config.colors.default)
            .setTitle(`Info on ${interaction.user.tag}`)
            .addFields(
                { name: 'Activity', value: `Invited \`${dbGuildMember.invites}\` users.` },
                { name: 'ID', value: `${dbGuildMember.id}` },
                { name: 'Inviter', value: 'No data.' }
            );

        interaction.reply({
            embeds: [embed],
            ephemeral: false
        }).catch(() => { });
    }
};