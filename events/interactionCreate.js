const { Client, Interaction, WebhookClient } = require("discord.js");
const GuildMember = require("../models/GuildMember");
const config = require("../config");

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
    if (!interaction.inGuild()) return;

    if (interaction.isCommand() || interaction.isUserContextMenu()) {
        const { type } = await client.application.commands.fetch(interaction.commandId);
        try {
            const filePath = {
                "CHAT_INPUT": `../commands/chat-input/${interaction.commandName}`,
                "USER": `../commands/user/${interaction.commandName.split(" ").join("-").toLocaleLowerCase()}`
            }[type];
            const { onlyOwners, inDev, exe } = require(filePath);
            const isOwner = config.ownersId.concat(config.ownerId).includes(interaction.user.id);
            if (inDev) {
                if (isOwner) {
                    exe(client, interaction);
                } else {
                    interaction.reply({
                        embeds: [{
                            color: config.colors.yellow,
                            description: `🚧 The command is under development!`
                        }],
                        ephemeral: true
                    }).catch(() => { });
                }
            } else {
                if (type === "USER") {
                    if (interaction.targetUser.bot) {
                        return interaction.reply({
                            embeds: [{
                                color: config.colors.red,
                                description: `You can't do it for a bot!`
                            }],
                            ephemeral: true
                        }).catch(() => { });
                    } else if (interaction.targetUser.id === interaction.user.id) {
                        return interaction.reply({
                            embeds: [{
                                color: config.colors.red,
                                description: `You can't do it for yourself.`
                            }],
                            ephemeral: true
                        }).catch(() => { });
                    }
                }
                if (onlyOwners) {
                    if (isOwner) {
                        exe(client, interaction);
                    } else {
                        interaction.reply({
                            embeds: [{
                                color: config.colors.red,
                                description: `You don't have permission!`
                            }],
                            ephemeral: true
                        });
                    }
                } else {
                    const guildMember = await GuildMember.findOne({
                        id: interaction.user.id,
                        guildID: interaction.guild.id
                    });

                    if (!guildMember) {
                        const newGuildMember = new GuildMember({
                            id: interaction.user.id,
                            guildID: interaction.guild.id,
                            fake: 0,
                            bonus: 0,
                            leaves: 0,
                            invites: 0,
                            invitedBy: null,
                            usedInvite: null
                        });
                        await newGuildMember.save();
                    }
                    exe(client, interaction);
                }
            }
        } catch (error) {
            new WebhookClient(config.webhooks.error).send({
                embeds: [{
                    color: config.colors.red,
                    title: `A new error has occurred!`,
                    description: `> Command (\`${type}\`): \`/${interaction.commandName}\` ${interaction.options.data.map(({ name, value }) => `<\`${name}\`: \`${value}\`>`).join(" ")}\n> User: \`${interaction.user.tag}\`\n> Guild: \`${interaction.guild.name}\``,
                    fields: [
                        {
                            name: "Code",
                            value: `\`\`\`${error.code}\`\`\``
                        },
                        {
                            name: "Message",
                            value: `\`\`\`${error.message}\`\`\``
                        }
                    ],
                    timestamp: new Date()
                }]
            }).then(() => {
                interaction.reply({
                    embeds: [{
                        color: config.colors.red,
                        description: `An error has occurred, the error has been submitted to the developers.`
                    }],
                    ephemeral: true
                });
            }).catch(() => { });
        };
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "bug-modal") {
            new WebhookClient(config.webhooks.bug).send({
                embeds: [{
                    color: config.colors.yellow,
                    author: {
                        name: interaction.user.tag,
                        icon_url: interaction.user.avatarURL({ dynamic: true })
                    },
                    description: `A user has just submitted his bug to us,\`\`\`${interaction.fields.getTextInputValue("bug-modal-input")}\`\`\``,
                    fields: [{
                        name: "ID",
                        value: `\`\`\`ini\nUSER = ${interaction.user.id}\nGUILD = ${interaction.guildId}\`\`\``
                    }],
                    timestamp: Date.now()
                }]
            }).then(() => {
                interaction.reply({
                    embeds: [{
                        color: config.colors.default,
                        description: `Thanks for submitting your bug!`
                    }],
                    ephemeral: true
                });
            }).catch(({ stack }) => console.error("Report-bug", stack));
        };
    }
};