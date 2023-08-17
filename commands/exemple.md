# CommandInteraction
const { Client, CommandInteraction } = require("discord.js");
const config = require("../../config");
const constructors = require("../../constructors");
const lib = require("../../lib");

module.exports = {
    data: {
        description: ""
    },
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async exe(client, db, interaction) {

    }
};

# UserContextMenuInteraction
const { Client, UserContextMenuInteraction } = require("discord.js");
const config = require("../../config");
const constructors = require("../../constructors");
const lib = require("../../lib");

module.exports = {
    data: {},
    onlyOwners: false,
    inDev: false,
    /**
     * 
     * @param {Client} client 
     * @param {UserContextMenuInteraction} interaction 
     */
    async exe(client, db, interaction) {

    }
};