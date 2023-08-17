const { Client, CommandInteraction } = require("discord.js");
const mongoose = require('mongoose');
const GuildMember = require("../../models/GuildMember");
const config = require("../../config");

module.exports = {
    data: {
        description: "View the invitations of a member.",
        options: [
            {
                type: "USER",
                name: "user",
                description: "See a member's invitations.",
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
            // Vérifier l'état de la connexion à la base de données
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

            const dbInvites = await GuildMember.findOne({ id: memberId, guildID: interaction.guild.id });

            // Vérifier si les données ont été trouvées
            if (!dbInvites) {
                console.log("Data not found in the database");
                return;
            }

            // Afficher les données récupérées
            console.log(dbInvites);

            interaction.reply({
                embeds: [{
                    color: config.colors.default,
                    author: {
                        name: memberName,
                        icon_url: memberAvatar
                    },
                    description: `You have **${dbInvites.invites.toString()}** invites! (**${dbInvites.bonus.toString()}** bonus, **${dbInvites.leaves.toString()}** leaves, **${dbInvites.fake.toString()}** fake)`
                }]
            }).catch((error) => {
                console.error("Error during interaction reply:", error);
            });
        } catch (error) {
            console.error("Error in invites command:", error);
        }
    }
};