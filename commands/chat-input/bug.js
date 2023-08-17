const { Client, CommandInteraction } = require("discord.js");
const config = require("../../config");

module.exports = {
    data: {
        description: "Report a bug to support."
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, interaction) {
        interaction.showModal({
            title: "Report a bug...",
            customId: "bug-modal",
            components: [{
                type: "ACTION_ROW",
                components: [{
                    type: "TEXT_INPUT",
                    style: "PARAGRAPH",
                    customId: "bug-modal-input",
                    label: "Please specify the bug",
                    placeholder: "Example: \"/bug doesn't work. It doesn't mention the user I'm trying to mention.\"",
                    required: true,
                    maxLength: 500
                }]
            }]
        }).catch(() => { });
    }
};