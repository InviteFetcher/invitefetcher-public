const { Client, WebhookClient } = require("discord.js");
const config = require("../config");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    new WebhookClient(config.webhooks.shard).send({
        embeds: [{
            color: config.colors.red,
            description: `The bot has disconnected! (<t:${Math.floor(Date.now()/1000)}:R>)`
        }]
    }).catch(({ stack }) => console.error("shard", stack));
};