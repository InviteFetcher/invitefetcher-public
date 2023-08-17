const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config");

module.exports = mongoose.model("Guild", new Schema({
    id: { type: String },

    joinMessage: { type: String, default: null },
    joinChannel: { type: String, default: null },
    leaveMessage: { type: String, default: null },
    leaveChannel: { type: String, default: null },

    premium: { type: Boolean, default: false },
    premiumCode: { type: String, default: null },
    premiumExpiration: { type: String, default: null }
}));