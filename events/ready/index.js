const { Client } = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const config = require("../../config");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
  console.log(`[Bot] Logged in as ${client.user.tag}`);

  require("../../app")(client);

  client.user.setPresence({
    status: "online",
    activities: [{
      name: `/help | ${config.app.host}:${config.app.port}`,
      type: "WATCHING"
    }]
  });

  mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("[DB] Database connected");
  });

  const commandsFilesChatInput = fs.readdirSync("./commands/chat-input").filter((file) => file.endsWith(".js"));
  for (const file of commandsFilesChatInput) {
    let { data } = require(`../../commands/chat-input/${file}`);
    data.type = "CHAT_INPUT";
    data.name = file.replace(/\.[^.]*$/, "");
    client.application.commands.create(data).then(() => {
      console.log(`[Bot] Command loaded (CHAT_INPUT): ${data.name}`);
    }).catch(({ stack }) => console.error(`[Bot] Command error "${data.name}" (CHAT_INPUT):`, stack));
  };

  const commandsFilesUser = fs.readdirSync("./commands/user").filter((file) => file.endsWith(".js"));
  for (const file of commandsFilesUser) {
    let { data } = require(`../../commands/user/${file}`);
    data.type = "USER";
    data.name = file.replace(/\.[^.]*$/, "").split("-").map((string) => string.charAt(0).toUpperCase() + string.slice(1)).join(" ");
    client.application.commands.create(data).then(() => {
      console.log(`[Bot] Command loaded (USER): ${data.name}`);
    }).catch(({ stack }) => console.error(`[Bot] Command error "${data.name}" (USER):`, stack));
  };
};