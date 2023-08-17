const { Client, CommandInteraction } = require("discord.js");
const config = require("../../config");
const Guild = require("../../models/Guild");

module.exports = {
    data: {
        description: "Configure welcome message and channel."
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
                description: `In which channel, the welcome messages will be sent?`
            }]
        });

        const channelCollector = interaction.channel.createMessageCollector({ filter, max: 1 });

        channelCollector.on("collect", async (msg) => {
            const welcomeChannel = msg.mentions.channels.first();
            if (!welcomeChannel || !welcomeChannel.isText()) {
                return interaction.followUp({
                    embeds: [{
                        color: config.colors.red,
                        description: `You must mention a text channel that exists.`
                    }]
                });
            }

            const guildData = await Guild.findOne({ id: interaction.guild.id }) || new Guild({ id: interaction.guild.id });
            guildData.joinChannel = welcomeChannel.id;
            await guildData.save();

            await interaction.followUp({
                embeds: [{
                    color: config.colors.default,
                    description: `What message do you want the bot to send when a member joins the server?`
                }]
            });

            const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1 });

            messageCollector.on("collect", async (message) => {
                const welcomeMessage = message.content;
                guildData.joinMessage = welcomeMessage;
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