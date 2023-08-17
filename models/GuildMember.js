const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model("GuildMember", new Schema({
    id: { type: String },
    guildID: { type: String },

    fake: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    leaves: { type: Number, default: 0 },
    invites: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },

    invitedBy: { type: String },
    usedInvite: { type: Object }
}));