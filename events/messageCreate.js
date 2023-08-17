const { Client, Message } = require("discord.js");
const GuildMember = require("../models/GuildMember");

/**
 * 
 * @param {Client} client 
 * @param {Message} message
 */
module.exports = async (client, message) => {
    try {
        if (message.author.bot) return;

        client.cooldowns = new Set();

        const { guild, author } = message;
        const memberId = author.id;
        const guildId = guild.id;

        if (client.cooldowns.has(memberId)) return;

        client.cooldowns.add(memberId);
        setTimeout(() => {
            client.cooldowns.delete(memberId);
        }, 3000);

        const dbMember = await GuildMember.findOne({ id: memberId, guildID: guildId });

        if (!dbMember) {
            const newMember = new GuildMember({
                id: memberId,
                guildID: guildId,
                messages: 1
            });
            await newMember.save();
        } else {
            dbMember.messages += 1;
            await dbMember.save();
        }
    } catch (error) {
        console.error("Error in messageCreate event:", error);
    }
};