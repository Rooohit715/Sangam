const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", ideaSchema);
