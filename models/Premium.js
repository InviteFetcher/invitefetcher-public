const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model("Premium", new Schema({
    code: { type: String },
    dateExpiration: { type: String }
}));