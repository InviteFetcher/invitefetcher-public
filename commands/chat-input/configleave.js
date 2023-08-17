const { Client, CommandInteraction } = require("discord.js");
const config = require("../../config");
const Guild = require("../../models/Guild");

module.exports = {
    data: {
        description: "Configure leave message and channel."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({
                embeds: [{
                    color: config.colors.red,
                    description: `You do not have \`MANAGE_MESSAGES\` permission to use this command.`
                }]
            });
        }

        await interaction.deferReply();

        const filter = (msg) => msg.author.id === interaction.user.id;

        await interaction.followUp({
            embeds: [{
                color: config.colors.default,
                description: `In which channel, the leave messages will be sent?`
            }]
        });

        const channelCollector = interaction.channel.createMessageCollector({ filter, max: 1 });

        channelCollector.on("collect", async (msg) => {
            const leaveChannel = msg.mentions.channels.first();
            if (!leaveChannel || !leaveChannel.isText()) {
                return interaction.followUp({
                    embeds: [{
                        color: config.colors.red,
                        description: `You must mention a text channel that exists.`
                    }]
                });
            }

            const guildData = await Guild.findOne({ id: interaction.guild.id }) || new Guild({ id: interaction.guild.id });
            guildData.leaveChannel = leaveChannel.id;
            await guildData.save();

            await interaction.followUp({
                embeds: [{
                    color: config.colors.default,
                    description: `What message do you want the bot to send when a member leave the server?`
                }]
            });

            const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1 });

            messageCollector.on("collect", async (message) => {
                const leaveMessage = message.content;
                guildData.leaveMessage = leaveMessage;
                await guildData.save();

                interaction.followUp({
                    embeds: [{
                        color: config.colors.default,
                        description: `The information provided has been saved in the database.`
                    }]
                });
            });
        });
    }
};