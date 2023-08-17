const { Client, CommandInteraction } = require("discord.js");
const mongoose = require('mongoose');
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
    data: {
        description: "Display the amount of messages sent by yourself or the mentioned member.",
        options: [
            {
                type: "USER",
                name: "user",
                description: "See a member's messages.",
                required: false
            }
        ]
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        try {
            if (mongoose.connection.readyState !== 1) {
                console.log("Database connection not established");
                return;
            }

            let memberId = interaction.user.id;
            let memberName = `${interaction.user.username}#${interaction.user.discriminator}`;
            let memberAvatar = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`;

            const targetMember = interaction.options.getMember('user');
            if (targetMember) {
                memberId = targetMember.id;
                memberName = `${targetMember.user.username}#${targetMember.user.discriminator}`;
                memberAvatar = `https://cdn.discordapp.com/avatars/${targetMember.user.id}/${targetMember.user.avatar}`;
            }

            let dbMessages = await GuildMember.findOne({ id: memberId, guildID: interaction.guild.id });

            if (!dbMessages) {
                dbMessages = new GuildMember({
                    id: memberId,
                    guildID: interaction.guild.id,
                    messages: 0
                });
                await dbMessages.save();
            }

            console.log(dbMessages);

            interaction.reply({
                embeds: [{
                    color: config.colors.default,
                    author: {
                        name: memberName,
                        icon_url: memberAvatar
                    },
                    description: `You sent a total of **${dbMessages.messages.toString()}** messages in this server.`
                }]
            }).catch((error) => {
                console.error("Error during interaction reply:", error);
            });
        } catch (error) {
            console.error("Error in messages command:", error);
        }
    }
};